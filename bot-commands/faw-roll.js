import {SlashCommandBuilder} from 'discord.js';
import FawGameCache from "../FawGameCache.js";
import FortuneAndWinds from "../fortune-and-winds.js";

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

        let response ='```';

        if(!faw.getRemainingThrows())
        {
            faw = FawGameCache.newThrow(interaction.channelId, interaction.user.id);
            response+='You have started a new hand.\n';
        }
        response += `Roll ${faw.throws+1} of 3:\n`;
        let roll = faw.roll();

        let handKeys = [];
        let handRolls = [];
        for(let [key, value] of Object.entries(roll))
        {
            handKeys.push(key.padEnd(6, ' '));
            handRolls.push(value.padEnd(6, ' '));
        }

        response += `Dice:   ${handKeys.join('')}\nValues: ${handRolls.join('')}\n`;

        if(roll.Void === 'Moon')
        {
            response += "You have rolled Lord Moon and therefore lost.```";
            interaction.reply(response);
            return;
        }

        let hand = FortuneAndWinds.checkHand(faw.getHand());
        response += `${hand.payout?`You have rolled ${hand.name}, which pays out at ${hand.payout}:1`:"Not a winning hand"}\`\`\``;
        interaction.reply(response);
    },
};