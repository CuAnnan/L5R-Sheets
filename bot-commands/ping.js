import {SlashCommandBuilder} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Returns with pong. That's all. Used for dev work.")
    ,
    async execute(interaction) {
        interaction.reply('pong');
    },
};