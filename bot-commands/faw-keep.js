import {SlashCommandBuilder} from 'discord.js';
import FawGameCache from "../FawGameCache.js";

export default {
    data: new SlashCommandBuilder()
        .setName('faw-keep')
        .setDescription("Rolls dice for Fortune and Wind")
        .addStringOption(option =>
            option
                .setName('dice-to-keep')
                .setDescription('Space separated dice to keep')
                .setRequired(false))
    ,
    async execute(interaction) {
        let faw = FawGameCache.getPlayerFaW(interaction.channelId, interaction.user.id);
        if(!faw)
        {
            interaction.reply("You do not have a current FaW hand.");
            return;
        }
        let diceToKeep = interaction.options.getString('dice-to-keep');
        let dice = [];
        if(diceToKeep)
        {
            dice = diceToKeep.split(' ');
        }
        let keeps = faw.keep(dice);
        interaction.reply(`You will keep ${keeps.keep.join(' ')} and roll ${keeps.roll.join(' ')}`);
    },
};