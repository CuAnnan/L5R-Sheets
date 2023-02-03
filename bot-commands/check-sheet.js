import {SlashCommandBuilder} from 'discord.js';
import Sheet from '../sheet.js';
import loadSheet from '../loadSheet.js';
import objectHash from 'object-hash';

export default {
    data: new SlashCommandBuilder()
        .setName('check-sheet')
        .setDescription("Check's the validity of the sheet being rolled against its published version")
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
        }

        let targetAt = interaction.options.getString('player-name');
        let match = targetAt.match(/<@(\d+)>/);
        if(match)
        {
            let member = await interaction.guild.members.fetch(match[1]);
            let nick = member.nickname? member.nickname: member.user.username;

            let localSheet = await loadSheet(interaction.guildId, match[1]);
            if(!localSheet)
            {
                interaction.reply({content:`No sheet could be found for ${nick}.`, ephemeral:true});
                return;
            }
            let localHash = objectHash(localSheet.toJSON());

            let remoteSheet = await Sheet.fromGoogleSheetsURL(localSheet.sheetURL);
            let remoteHash = objectHash(remoteSheet.toJSON());
            if(localHash !== remoteHash)
            {
                interaction.reply({content:`Sheet for ${nick} does not match sheet on file.`, ephemeral:true});
                return;
            }

            interaction.reply({content:`Sheet for ${nick} matches sheet on file.`, ephemeral:true});
            return;
        }
        interaction.reply("Sorry, I couldn't resolve the input.");
    },
};
