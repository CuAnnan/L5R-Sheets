import {SlashCommandBuilder} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('check-out')
        .setDescription("Check in as ready for RP")
    ,
    async execute(interaction) {
        const target = interaction.member;
        const checkedInRole = target.guild.roles.cache.find(r=>r.name==='checked in');
        await target.roles.remove(checkedInRole);
        interaction.reply({content:'You have been checked out.', ephemeral:true});
    },
};