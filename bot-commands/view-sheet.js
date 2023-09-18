import {SlashCommandBuilder} from 'discord.js';
import loadSheet from "../loadSheet.js";

export default {
    data: new SlashCommandBuilder()
        .setName('view-sheet')
        .setDescription("Gets the html link for a player")
        .addStringOption(option=>
            option
                .setName('player-name')
                .setDescription("@<the player>")
                .setRequired(true)
        )
    ,
    async execute(interaction) {
        let hasFortuneRole =interaction.member.roles.cache.find(role=>role.name==='Fortunes');
        if(!hasFortuneRole)
        {
            interaction.reply({content:'You do not have sufficient permissions to run this command', ephemeral:true});
            return;
        }


        let target = interaction.options.getString('player-name');

        let match = target.match(/<@(\d+)>/);
        if(match)
        {
            let member = await interaction.guild.members.fetch(match[1]);
            let nick = member.nickname? member.nickname: member.user.username;

            let localSheet = await loadSheet(interaction.guildId, match[1]);
            if(!localSheet)
            {
                interaction.reply({content:`No sheet could be found for ${nick}`, ephemeral:true});
            }
            let sheetURL = localSheet.sheetURL.replace(/xlsx$/, 'html');
            interaction.reply({content:`The requested sheet for ${nick}: ${sheetURL}`, ephemeral:true});
            return;
        }
        interaction.reply("Sorry, I couldn't resolve the input.");
    },
};