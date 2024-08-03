import {SlashCommandBuilder} from 'discord.js';
import rollParser from "../RollParser.js";
import logger from "../logger.js";

export default {
    data: new SlashCommandBuilder()
        .setName('st-roll')
        .setDescription("Roll for another player using l5r's roll n keep m system, herein referred to as as nKm")
        .addStringOption(option =>
            option
                .setName('whattoroll')
                .setDescription("Format: <nKm or a ring, trait, skill, or spell> (/roll help for full breakdown)")
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('whotorollfor')
                .setDescription("Format: @Username")
                .setRequired(true))
    ,
    async execute(interaction) {
        const args = interaction.options.getString('whattoroll').trim();
        if (args.toLowerCase() === 'help') {
            interaction.reply('See /roll help');
            return;
        }
        rollParser(args, interaction.guildId, interaction.user.id).then((response) => {
            interaction.reply({content: response});
        }).catch((e) => {
            logger.warn(interaction.options.getString('whattoroll').trim());
            logger.warn(e);
            interaction.reply({content: e.message, ephemeral: true});
        }).finally(() => {
            logger.info('Finally block executing');
        });
    },
};