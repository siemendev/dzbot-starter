import { REST, Routes } from 'discord.js'
import { commands } from './commands.js'
import { env } from './dzbot.js'

const rest = new REST().setToken(env.discordToken)
const route = env.discordGuildId
  ? Routes.applicationGuildCommands(env.discordAppId, env.discordGuildId)
  : Routes.applicationCommands(env.discordAppId)
await rest.put(route, { body: commands })
console.log(`Registered ${commands.length} command(s)${env.discordGuildId ? ' on the guild' : ' globally'}.`)
