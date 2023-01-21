import {SlashCommandBuilder} from 'discord.js';
import Sheet from '../sheet.js';
import mongoClient from '../db.js';
import SheetCache from '../SheetCache.js';
let db = mongoClient.db('l5r');

export default {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Fetches a sheet from google sheets')
        .addStringOption(option =>
            option
                .setName('rollable')
                .setDescription('The published URL of the google sheet. This must be in xslx format.')
                .setRequired(true))
        .addStringOption(option=>
            option
                .setName('emphasis')

        )
    ,
    async execute(interaction) {
        const url = interaction.options.getString('url');
        try
        {

            Sheet.fromGoogleSheetsURL(url).then(function(sheet) {
                let sheetJSON = sheet.toJSON();
                db.collection('sheets').updateOne({guildId:interaction.guildId, userId:interaction.user.id}, {$set:{sheet:sheetJSON}}, {upsert:true});
                SheetCache.storeSheet(interaction.guildId, interaction.user.id, sheet);
                interaction.reply('Your sheet has been updated.');
            });
        }
        catch(e)
        {
            interaction.reply("I'm sorry, there was an error loading your sheet");
        }
    },
};