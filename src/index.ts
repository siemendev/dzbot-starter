import { discord } from './bot.js'
import { env } from './dzbot.js'
import { web } from './web.js'

web.listen(env.port, () => console.log(`Web: ${env.publicUrl} (webhooks at /webhooks/dzbot)`))
await discord.login(env.discordToken)
