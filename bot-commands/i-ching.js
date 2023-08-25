import {SlashCommandBuilder, EmbedBuilder, AttachmentBuilder} from 'discord.js';
import {IChing} from '../I-Ching.js';

export default {
    data: new SlashCommandBuilder()
        .setName('divine')
        .setDescription("Generates an I-Ching Hexagram and any derived Hexagrams that unfold")
    ,
    async execute(interaction) {
        const hex = IChing.generateHex();
        const imgName = hex.name.replace(' ','-');
        const hexImage = new AttachmentBuilder(`./imgs/${imgName}.png`);
        const files = [hexImage];
        const embeds = [
            new EmbedBuilder()
                .setTitle(`Your ${hex.hasDerivation?'first ':''}Hexagram:`)
                .setImage(`attachment://${imgName}.png`)
                .addFields({'name':"Hexagram", value:hex.name}),
        ];
        if(hex.hasDerivation)
        {
            const derivation = hex.derivation;
            const derivedName = derivation.name.replace(' ','-');
            const derivedHexImage = new AttachmentBuilder(`./imgs/${derivedName}.png`);
            files.push(derivedHexImage);
            embeds.push(
                new EmbedBuilder()
                    .setTitle('Which yields:')
                    .setImage(`attachment://${derivedName}.png`)
                    .addFields({'name':'Hexagram', value:derivation.name})
            )
        }
        interaction.reply({embeds, files});
    },
};