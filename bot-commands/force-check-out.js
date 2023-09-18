import {SlashCommandBuilder} from 'discord.js';
import loadSheet from "../loadSheet.js";

export default {
    data: new SlashCommandBuilder()
        .setName('check-player-out')
        .setDescription("Forcibly check a player out")
        .addStringOption(option =>
            option
                .setName('player-name')
                .setDescription('An @reference to the player or the word "all".')
                .setRequired(true))
    ,
    async execute(interaction) {
        try
        {
            let hasFortuneRole = interaction.member.roles.cache.find(role => role.name === 'Fortunes');
            if (!hasFortuneRole) {
                interaction.reply({
                    content: 'You do not have sufficient permissions to run this command',
                    ephemeral: true
                });
                return;
            }

            const checkedInRole = interaction.guild.roles.cache.find(r => r.name === 'checked in');
            const target = interaction.options.getString('player-name');

            if (target.toLowerCase() === 'all') {
                checkedInRole.members.each(member => {
                    member.roles.remove(checkedInRole);
                });
                interaction.reply({content: `Checked out all checked in players`, ephemeral: true});
                return;
            }

            const match = target.match(/<@(\d+)>/);
            if (match) {
                let member = await interaction.guild.members.fetch(match[1]);
                let nick = member.nickname ? member.nickname : member.user.username;
                await member.roles.remove(checkedInRole);

                interaction.reply({content: `Checked out ${nick}`, ephemeral: true});
                return;
            }

            interaction.reply({content:"Sorry, I couldn't resolve the input.", ephemeral:true});
        }
        catch(e)
        {
            interaction.reply({content:e.message, ephemeral: true});
        }
    },
};