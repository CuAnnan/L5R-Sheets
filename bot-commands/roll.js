import {SlashCommandBuilder} from 'discord.js';
import rollParser from '../RollParser.js';
import logger from '../logger.js';

export default {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription("Roll using l5r's roll n keep m system, herein referred to as as nKm")
        .addStringOption(option =>
            option
                .setName('whattoroll')
                .setDescription("Format: <nKm or a ring, trait, skill, or spell> (/roll help for full breakdown)")
                .setRequired(true))
    ,
    async execute(interaction) {
        const args = interaction.options.getString('whattoroll').trim();
        if(args.toLowerCase()==='help')
        {
            interaction.reply(
                '***Roll Syntax***\n\n' +
                '/roll <nKm or a ring, trait, skill, or spell>[ !no10s|!nr][ !rv<reroll value>][ !e][ +nKm][ +<amount>][ vs:|tn:<target number>][# any comment you like]\n\n' +
                'Fields in <> are mandatory, fields in [] are optional, everything after the # is treated as a comment shown after the roll. Everything after any subsequent # is ignored.\n\n' +
                '**Optional fields:**\n' +
                '**!no10s *or* !nr**: do not reroll 10s.\n' +
                '**\!rv<reroll value>**: Reroll on <reroll value> instead of 10.\n' +
                '**!e**: reroll 1s once each for emphases\n' +
                '**+nKm**: add +nKm to the rolled value (mostly useful in rolling off your sheet rather than raw nKm but can be used in either)\n' +
                '**+<amount>** adds <amount> to the final result\n' +
                '**vs:<TN>** *or* **tn:<TN>** rolls against a TN Of <TN>');
            return;
        }
        rollParser(args, interaction.guildId, interaction.user.id).then((response)=>{
            interaction.reply({content:response});
        }).catch((e)=>{
            logger.warn(interaction.options.getString('whattoroll').trim());
            logger.warn(e);
            interaction.reply({content:e.message, ephemeral:true});
        }).finally(()=>{
            logger.info('Finally block executing');
        });

    },
};