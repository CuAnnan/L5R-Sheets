import {SlashCommandBuilder} from 'discord.js';
import CheckInHandler from '../CheckInHandler.js';

export default {
    data: new SlashCommandBuilder()
        .setName('check-in')
        .setDescription("Check in as ready for RP")
    ,
    async execute(interaction) {
        const target = interaction.member;
        await CheckInHandler.checkTargetIn(target);
        interaction.reply('You have been checked in.');
    },
};