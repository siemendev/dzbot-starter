import { Client, Events, GatewayIntentBits, type SendableChannels } from 'discord.js'
import type { DzbotEvent } from '@dzbot/sdk'
import { handleBalance } from './commands.js'
import { env } from './dzbot.js'

export const discord = new Client({ intents: [GatewayIntentBits.Guilds] })

discord.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return
  if (interaction.commandName === 'balance') await handleBalance(interaction).catch((e) => console.error(e))
})

discord.once(Events.ClientReady, (client) => console.log(`Discord: logged in as ${client.user.tag}`))

async function killfeedChannel(): Promise<SendableChannels | null> {
  if (!env.killfeedChannelId) return null
  const channel = await discord.channels.fetch(env.killfeedChannelId)
  return channel?.isSendable() ? channel : null
}

/** Posts one kill. The event comes from dzbot's webhook: dzbot read it from the server logs, nobody polls. */
export async function postKill(event: DzbotEvent<'log.player_kill'>): Promise<void> {
  const channel = await killfeedChannel()
  if (!channel) return
  const { killer, victim, weapon, distance, flags } = event.payload.data
  const labels = [flags.headshot && 'headshot', flags.revenge && 'revenge', flags.team_kill && 'team kill'].filter(Boolean)
  await channel.send(`**${killer.username}** killed **${victim.username}** with ${weapon} (${Math.round(distance)} m)${labels.length ? ` · ${labels.join(' · ')}` : ''}`)
}
