import {SlashCommandBuilder} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('faw-help')
        .setDescription("Get the help for Fortunes and wind")
    ,
    async execute(interaction) {
        interaction.reply('```Fortunes and Wind is described in L4R The Way of the Scorpion from page 107.\n' +
            'A turn is comprised of up to three throws of five dice; Earth, Fire, Air, Water, and Void.\n' +
            'Winning hands are comprised of specific values:' +
            '\tFortunes and Winds: North, East, West, South and Fortune. Pays out 4:1\n' +
            "\tThe Lady's Breath: North, East, West, South and Sun. Pays out at 4:1" +
            "\tEmpty Winds: North, East, West, South, and Void. Pays out at 2:1" +
            "\tShinsei's Blessing: Earth, Water, Fire, Air and Void. Pays out at 2:1" +
            "\tThe Lady's Tears: Earth Water, Fire, Air and Sun. Pays out at 2:1" +
            "\tSeven Thunders: Earth, Water, Fire, Air and Fortune. Pays out at 1:1" +
            "```");
    },
};