import { MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { DzbotError } from '@dzbot/sdk'
import { dzbot } from './dzbot.js'

export const balanceCommand = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('Shows your balance on the server')

/** /balance: dzbot already knows which player belongs to which Discord account, so the bot just asks. */
export async function handleBalance(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral })
  try {
    const player = await dzbot.players.findByDiscordId(interaction.user.id)
    if (!player) {
      await interaction.editReply('No player is linked to your Discord account yet. Sign in on the server website and link your game account.')
      return
    }
    await interaction.editReply(`**${player.name}**: ${player.balance ?? 0} on your account.`)
  } catch (e) {
    await interaction.editReply(e instanceof DzbotError ? `dzbot said no: ${e.message}` : 'Something went wrong.')
    throw e
  }
}

export const commands = [balanceCommand.toJSON()]
