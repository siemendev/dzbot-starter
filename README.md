# dzbot starter

A DayZ Discord bot and website built on [dzbot](https://dzbot.de) — start here instead of writing log parsers,
a Nitrado integration, account linking and a database of your own.

What it does out of the box:

- **`/balance`** — a slash command that shows a player their balance. dzbot knows which game account belongs
  to which Discord user, so the bot only asks.
- **Kill feed from a webhook** — dzbot reads your server's logs and sends every kill to `/webhooks/dzbot`; the bot
  posts it to a channel in its own words.
- **Sign in with dzbot** — players sign in on your server's dzbot page (linking their game account there if they
  haven't yet) and land back on your site, signed in.

Built with TypeScript, [discord.js](https://discord.js.org), Express and [`@dzbot/sdk`](https://www.npmjs.com/package/@dzbot/sdk).

## Setup

You need a Nitrado DayZ server on dzbot Pro, and a Discord application with a bot.

1. In your server's admin area on dzbot, open **Developers** and create an app.
   - **Keys**: create a key with `admin.players.view` (for `/balance`).
   - **Webhooks**: add `https://<where this runs>/webhooks/dzbot` with the event `log.player_kill`.
   - **Sign in with dzbot**: add `http://localhost:3000/auth/callback` as redirect URI.
2. `cp .env.example .env` and fill it in.
3. `npm install`, `npm run register-commands`, `npm run dev`.

For webhooks on your own machine, expose port 3000 with a tunnel (for example `cloudflared tunnel --url
http://localhost:3000`) and use that URL in the webhook.

## Next steps

Everything dzbot does is in reach: players and their alts, wallets, the shop and orders, tickets, factions,
bounties, bases, zones, events, leaderboards and the logs. See [developers.dzbot.de](https://developers.dzbot.de/)
and [`AGENTS.md`](AGENTS.md) if a coding agent builds with you.

MIT licensed. DayZ is a trademark of Bohemia Interactive a.s.; dzbot is not affiliated with Bohemia Interactive.
