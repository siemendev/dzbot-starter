# Building on dzbot — instructions for coding agents

This project is a DayZ community bot and website that runs **on top of dzbot**. dzbot is the backend: it is
connected to the owner's Nitrado server, reads its logs, and already holds the players, their linked Discord and
game accounts, wallets, the shop, tickets and everything else. Your job is the bot and the website around it —
not a second copy of what dzbot does.

## Read first

- https://developers.dzbot.de/llms.txt — index of the developer docs, one markdown file per page
- https://developers.dzbot.de/llms-full.txt — all of it in one file
- https://api.dzbot.de/api/docs.json — the OpenAPI spec (every endpoint)
- https://api.dzbot.de/api/developer/events — the event catalog (names, payload schemas, the rights to read them)

## Rules

- **Never rebuild what dzbot has.** No own log parsing, Nitrado API calls, player or account-linking tables,
  wallets/currency, shop or delivery, tickets, kill feed processing, leaderboards, alt or multi-account
  detection. Read and change them through `@dzbot/sdk`. Keep only data dzbot does not have in your own storage.
- **Use events, don't poll.** React to what happens on the server with webhooks (server side, `expressWebhook`)
  or live events (`dzbot.events.subscribe`, also in the browser). Poll the API at most once a minute for things
  that have no event.
- **Players are identified by dzbot.** Use Sign in with dzbot (`OAuthClient`) for anything a player does on the
  website; it resolves alts to the main account. In Discord, find the player with
  `dzbot.players.findByDiscordId(interaction.user.id)`.
- **Keys are secrets.** The API key (`dzk_…`), the webhook secret and the client secret stay on the server, in
  `.env`. Browser code uses a public OAuth client (no secret) only.
- **Rights decide everything.** The key and the app have access rights set by the server owner in dzbot
  (Developers). A `PermissionError` names the missing right: tell the user which right to add instead of working
  around it.
- **Lists go through the search**: `dzbot.search('<type>', filters)` — the types, filters and sorts are in
  `GET /api/admin/search/schema`.
- **Use the SDK's helpers first**, then the typed client for the rest: `new AdminApi(dzbot.configuration())`
  from `@dzbot/sdk/api`.

## Layout

- `src/dzbot.ts` — configuration and the dzbot client (API key)
- `src/commands.ts` — slash commands; `npm run register-commands` after adding one
- `src/bot.ts` — the Discord client and what it posts
- `src/web.ts` — Express: the webhook receiver and Sign in with dzbot
- `npm run typecheck` must pass before you're done.
