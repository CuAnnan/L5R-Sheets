import {SlashCommandBuilder} from 'discord.js';
import Sheet from '../sheet.js';
import mongoClient from '../db.js';
import SheetCache from '../SheetCache.js';
import logger from '../logger.js';

let db = mongoClient.db('l5r');

export default {
    data: new SlashCommandBuilder()
        .setName('fetch-sheet')
        .setDescription('Fetches a sheet from google sheets')
        .addStringOption(option =>
            option
                .setName('url')
                .setDescription('The published URL of the google sheet. This must be in xslx format.')
                .setRequired(true))
        ,
    async execute(interaction) {
        const url = interaction.options.getString('url');
        Sheet.fromGoogleSheetsURL(url).then(function(sheet) {
            let sheetJSON = sheet.toJSON();
            db.collection('sheets').updateOne({guildId:interaction.guildId, userId:interaction.user.id}, {$set:{sheet:sheetJSON}}, {upsert:true});
            SheetCache.storeSheet(interaction.guildId, interaction.user.id, sheet);
            interaction.reply({content:'Your sheet has been updated.', ephemeral:true});
        }).catch((e)=>{
            logger.warn(e);
            interaction.reply({content:'There was an error loading your sheet, a log file has been created', ephemeral:true});
        });
    },
};