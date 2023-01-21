import {SlashCommandBuilder} from 'discord.js';
import Sheet from '../sheet.js';
import mongoClient from '../db.js';

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
        console.log('This should be happening, should it not?');
        const url = interaction.options.getString('url');
        console.log(`Loading sheet at ${url}`)
        try
        {

            Sheet.fromGoogleSheetsURL(url).then(function(sheet) {
                console.log('Sheet loaded, storing in mongo instance');
                let sheetJSON = sheet.toJSON();
                db.collection('sheets').updateOne({guildId:interaction.guildId, userId:interaction.user.id}, {$set:{sheet:sheetJSON}}, {upsert:true});
                interaction.reply('Your sheet has been updated.');

                let newSheet = new Sheet(sheetJSON);
                console.log(newSheet);
            });
        }
        catch(e)
        {
            console.log(e);
            interaction.reply("I'm sorry, there was an error loading your sheet");
        }
    },
};