import {SlashCommandBuilder} from 'discord.js';
import FawGameCache from "../FawGameCache.js";

export default {
    data: new SlashCommandBuilder()
        .setName('faw-roll')
        .setDescription("Rolls dice for Fortune and Wind")
    ,
    async execute(interaction) {

        let faw = FawGameCache.getPlayerFaW(interaction.channelId, interaction.user.id);
        if(!faw)
        {
            faw = FawGameCache.addPlayer(interaction.channelId, interaction.user.id);
        }

        let response ='';

        if(!faw.getRemainingThrows())
        {
            faw = FawGameCache.newThrow(interaction.channelId, interaction.user.id);
            response+='You have started a new hand.\n';
        }
        faw.roll();
        response += `Roll ${faw.throws} of 3:\n${faw.getHand()}`;
        interaction.reply(response);
    },
};