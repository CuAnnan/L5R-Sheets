import {SlashCommandBuilder} from 'discord.js';
import Sheet from '../sheet.js';
import mongoClient from '../db.js';
import SheetCache from '../SheetCache.js';
import logger from '../logger.js';

let db = mongoClient.db('l5r');

export default {
    data: new SlashCommandBuilder()
        .setName('reload-sheet')
        .setDescription('Reacquires your sheet from google sheets.')
    ,
    async execute(interaction) {
        let sheetDocument = await db.collection('sheets').findOne({userId:interaction.user.id, guildId:interaction.guildId});
        if(!sheetDocument)
        {
            interaction.reply({content:'Could not find a sheet for you for this discord server', ephemeral:true});
            return;
        }
        let url = sheetDocument.sheet.url;
        Sheet.fromGoogleSheetsURL(url).then(function(sheet) {
            db.collection('sheets').updateOne({guildId:interaction.guildId, userId:interaction.user.id}, {$set:{sheet:sheet.toJSON()}}, {upsert:true});
            SheetCache.storeSheet(interaction.guildId, interaction.user.id, sheet);
            interaction.reply({content:'Your sheet has been updated.', ephemeral:true});
        }).catch((e)=>{
            logger.warn(e);
            interaction.reply({content:e.message, ephemeral:true});
        });
    },
};