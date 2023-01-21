import xlsx from 'xlsx';
import fetch from 'node-fetch';

export default class Sheet {
    constructor(json) {
        this.rings = {
            air: Math.min(json.traits.reflexes, json.traits.awareness),
            earth: Math.min(json.traits.stamina, json.traits.willpower),
            fire: Math.min(json.traits.agility, json.traits.intelligence),
            water: Math.min(json.traits.strength, json.traits.perception),
            void: json.void,
        };

        this.traits = json.traits;
    }

    toJSON()
    {
        return {
            traits:this.traits,
            void:this.rings.void,
        }
    }

    static async fromGoogleSheetsURL(url)
    {
        let response = await fetch(url);
        let buffer = await response.arrayBuffer();
        let document = xlsx.read(buffer);
        let baseSheet = document.Sheets[document.SheetNames[0]];
        let spellSheet = document.Sheets[document.SheetNames[1]];

        let traits = {};
        let range = xlsx.utils.decode_range('C2:D13');
        for (let row = range.s.r; row < range.e.r; row++) {
            let trait_cell = baseSheet[xlsx.utils.encode_cell({c: range.s.c, r: row})];
            if (trait_cell) {
                let value_cell = baseSheet[xlsx.utils.encode_cell({c: range.e.c, r: row})];
                traits[trait_cell.v.toLowerCase()] = parseInt(value_cell.v);
            }
        }


        let sheet = new Sheet({
            void: baseSheet['B15'].v,
            traits: traits
        });

        return sheet;
    }

}

