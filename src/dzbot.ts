import { Dzbot } from '@dzbot/sdk'

function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is missing; copy .env.example to .env and fill it in`)
  return value
}

export const env = {
  server: required('DZBOT_SERVER'),
  apiKey: required('DZBOT_API_KEY'),
  webhookSecret: process.env.DZBOT_WEBHOOK_SECRET ?? '',
  clientId: process.env.DZBOT_CLIENT_ID ?? '',
  clientSecret: process.env.DZBOT_CLIENT_SECRET ?? '',
  publicUrl: process.env.PUBLIC_URL ?? 'http://localhost:3000',
  port: Number(process.env.PORT ?? 3000),
  discordToken: required('DISCORD_TOKEN'),
  discordAppId: process.env.DISCORD_APP_ID ?? '',
  discordGuildId: process.env.DISCORD_GUILD_ID ?? '',
  killfeedChannelId: process.env.DISCORD_KILLFEED_CHANNEL_ID ?? '',
}

/** The bot's own access to dzbot: a server API key with the rights you gave it. */
export const dzbot = new Dzbot({ server: env.server, apiKey: env.apiKey, userAgent: 'dzbot-starter/0.1' })
