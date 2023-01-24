import {SlashCommandBuilder} from 'discord.js';
import Sheet from '../sheet.js';
import mongoClient from '../db.js';
import SheetCache from '../SheetCache.js';

let db = mongoClient.db('l5r');


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
        }


        let target = interaction.options.getString('player-name');

        let match = target.match(/\<\@(\d+)\>/);
        if(match)
        {
            let userId = match[1];
            let guildId = interaction.guildId;
            let sheet = SheetCache.getSheet(guildId, userId);
            if(!sheet)
            {
                let sheetDocument = await db.collection('sheets').findOne({userId:userId, guildId:guildId});
                if(!sheetDocument)
                {
                    interaction.reply({content:'No sheet could be found for user', ephemeral:true});
                    return;
                }
                let sheetJSON = sheetDocument.sheet;
                sheet = new Sheet(sheetJSON);
                SheetCache.storeSheet(guildId, userId, sheet);
            }
            let sheetURL = sheet.sheetURL.replace(/xlsx$/, 'html');
            interaction.reply({content:`The requested sheet: ${sheetURL}`, ephemeral:true});
            return;
        }
        interaction.reply("Sorry, I couldn't resolve the input.");
    },
};