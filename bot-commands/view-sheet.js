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
            option.setName('player-name')
        )
    ,
    async execute(interaction) {
        interaction.reply('pong');
    },
};