import {SlashCommandBuilder, EmbedBuilder} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('checked-in')
        .setDescription("Check in as ready for RP")
    ,
    async execute(interaction) {
        const checkedInRole = interaction.member.guild.roles.cache.find(r=>r.name==='checked in');
        console.log(interaction.member);
        const members = checkedInRole.members.map(m=>m.displayName);
        if(members.length)
        {
            let checkedInMembers = members.join(', ');
            const loggedInEmbed = new EmbedBuilder();
            loggedInEmbed.setColor(0x0099ff);
            loggedInEmbed.setTitle("Checked in players");
            loggedInEmbed.addFields(
                {name: "Players", value: checkedInMembers}
            );
            loggedInEmbed.addFields({
                name: "Total checked in players",
                value: ""+members.length
            });
            interaction.reply({embeds:[loggedInEmbed], ephemeral:true});
        }
        else
        {
            interaction.reply({content:'No members checked in', ephemeral:true});
        }
    },
};