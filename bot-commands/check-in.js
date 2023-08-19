import {SlashCommandBuilder} from 'discord.js';
import CheckInHandler from '../CheckInHandler.js';

export default {
    data: new SlashCommandBuilder()
        .setName('check-in')
        .setDescription("Check in as ready for RP")
    ,
    async execute(interaction) {
        const target = interaction.member;
        const checkedInRole = target.guild.roles.cache.find(r=>r.name==='checked in');
        await target.roles.add(checkedInRole);
        interaction.reply({content:'You have been checked in.', ephemeral:true});
    },
};