import { randomUUID } from 'node:crypto'
import express, { type Request, type Response } from 'express'
import { Dzbot, MemoryTokenStore, OAuthClient, expressWebhook, isEvent } from '@dzbot/sdk'
import { postKill } from './bot.js'
import { env } from './dzbot.js'

export const web = express()

// dzbot signs every delivery; the raw body is needed to check it, so this route comes before any JSON parser.
web.post('/webhooks/dzbot', express.raw({ type: 'application/json' }), expressWebhook(env.webhookSecret, async (event) => {
  if (isEvent(event, 'log.player_kill')) await postKill(event)
}))

// Sign in with dzbot. One token store per browser session; use Redis or your database in production.
const sessions = new Map<string, MemoryTokenStore>()

function session(req: Request, res: Response): MemoryTokenStore {
  const id = /(?:^|;\s*)sid=([\w-]+)/.exec(req.headers.cookie ?? '')?.[1]
  if (id && sessions.has(id)) return sessions.get(id)!
  const fresh = randomUUID()
  sessions.set(fresh, new MemoryTokenStore())
  res.setHeader('set-cookie', `sid=${fresh}; HttpOnly; SameSite=Lax; Path=/`)
  return sessions.get(fresh)!
}

function oauth(store: MemoryTokenStore): OAuthClient {
  return new OAuthClient({
    clientId: env.clientId,
    clientSecret: env.clientSecret,
    redirectUri: `${env.publicUrl}/auth/callback`,
    server: env.server,
    store,
  })
}

const page = (body: string) => `<!doctype html><meta charset="utf-8"><title>dzbot starter</title><body style="font-family:sans-serif;max-width:40rem;margin:3rem auto">${body}</body>`
const escape = (value: string) => value.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`)

web.get('/', async (req, res) => {
  const client = oauth(session(req, res))
  if (!(await client.isSignedIn())) {
    res.send(page('<h1>dzbot starter</h1><p><a href="/auth/login">Sign in with dzbot</a></p>'))
    return
  }
  const me = await new Dzbot({ server: env.server, oauth: client }).me()
  res.send(page(`<h1>Hi ${escape(me.player?.name ?? 'there')}</h1><p>Your accounts on this server: ${me.accounts.map((a) => escape(a.name)).join(', ') || '-'}</p><pre>${escape(JSON.stringify(me, null, 2))}</pre><p><a href="/auth/logout">Sign out</a></p>`))
})

web.get('/auth/login', async (req, res) => {
  res.redirect(await oauth(session(req, res)).authorizeUrl({ scope: ['player.shop.access'] }))
})

web.get('/auth/callback', async (req, res) => {
  try {
    await oauth(session(req, res)).handleCallback(`${env.publicUrl}${req.originalUrl}`)
    res.redirect('/')
  } catch (e) {
    res.status(400).send(page(`<p>Sign-in failed: ${escape(e instanceof Error ? e.message : String(e))}</p><p><a href="/">Back</a></p>`))
  }
})

web.get('/auth/logout', async (req, res) => {
  await oauth(session(req, res)).revoke()
  res.redirect('/')
})
