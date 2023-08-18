import {SlashCommandBuilder, EmbedBuilder} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('checked-in')
        .setDescription("Check in as ready for RP")
    ,
    async execute(interaction) {
        const checkedInRole = interaction.member.guild.roles.cache.find(r=>r.name==='checked in');
        const members = checkedInRole.members.map(m=>m.user.tag);
        const loggedInEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Checked in players")
            .addFields({name:"Players", value:members.join(', ')},{name:"Total logged in players", value:members.length});
        interaction.reply(loggedInEmbed);
    },
};