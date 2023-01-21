'use strict';
import xlsx from 'xlsx';
import fetch from 'node-fetch';
import Die from './Die.js';


class Rollable
{
    constructor(roll, keep)
    {
        this.toRoll = roll;
        this.toKeep = keep;
    }

    roll(emphasis= false, bonusToRoll = 0, bonusToKeep = 0, bonusToResult = 0)
    {
        let diceRolled = [];

        let toRoll = this.toRoll + bonusToRoll;

        let toKeep = this.toKeep + bonusToKeep;
        if(toRoll > 10)
        {
            let leftOvers = toRoll - 10;
            toRoll = 10;
            let bonusKeep = Math.floor(leftOvers / 2);
            toKeep += bonusKeep;
            if(toKeep > 10)
            {
                bonusToResult += (toKeep - 10) * 2;
                toKeep = 10;
            }
        }

        for(let i = 0; i < toRoll; i++)
        {
            diceRolled.push(Die.roll(true, emphasis));
        }
        let sortedDice = diceRolled.sort((a, b)=>{return b - a;});
        let result = bonusToResult;
        for(let i = 0; i < toKeep; i++)
        {
            result += sortedDice[i];
        }

        return {result:result, diceRolled:diceRolled, toRoll:toRoll, toKeep:toKeep, bonus:bonusToResult};
    }
}



class Trait extends Rollable
{
    constructor(name, value)
    {
        super(value, value);
        this.name = name;
        this.value = value;
    }

    toJSON()
    {
        return {name:this.name, value:this.value};
    }
}

class Ring extends Trait
{

}

class Skill extends Rollable
{
    constructor(name, trait, value)
    {
        super(trait.value + value, value);
        this.name = name;
        this.value = value;
        this.trait = trait.name;
    }

    toJSON()
    {
        return {name:this.name, value:this.value, trait:this.trait};
    }
}


class Sheet {
    constructor(json, sheetURL) {
        this.sheetURL = sheetURL
        this.traits = {};
        this._rollables = {};
        for(let [traitName, score] of Object.entries(json.traits))
        {
            let trait = new Trait(traitName, score);
            let lcTraitName = traitName.toLowerCase();
            this.traits[lcTraitName] = trait;
            this._rollables[lcTraitName] = trait;
        }

        this.rings = {
            air: new Ring('Air', Math.min(this.traits.reflexes.value, this.traits.awareness.value)),
            earth: new Ring('Earth', Math.min(this.traits.stamina.value, this.traits.willpower.value)),
            fire: new Ring('Fire', Math.min(this.traits.agility.value, this.traits.intelligence.value)),
            water: new Ring( 'Water', Math.min(this.traits.strength.value, this.traits.perception.value)),
            void: new Ring('Void', json.void),
        };
        for(let [ringName, ring] of Object.entries(this.rings))
        {
            this._rollables[ringName] = ring;
        }
        this.skills = {};
        for(let [skillName, skillJSON] of Object.entries(json.skills))
        {
            let traitName = skillJSON.trait.toLowerCase();
            let trait;
            if(Object.keys(this.traits).indexOf(traitName) >= 0)
            {
                trait = this.traits[traitName];
            }
            else if(Object.keys(this.rings).indexOf(traitName) >= 0)
            {
                trait= this.rings[traitName];
            }

            let skill = new Skill(skillJSON.name, trait, skillJSON.value);
            let skillNameLC = skillName.toLowerCase();
            if(this.skills[skillNameLC] || this.traits[skillNameLC] || this.rings[skillNameLC])
            {
                throw new Error(`Duplicate field key entry ${skill.name}`)
            }

            this.skills[skillNameLC] = skill;
            this._rollables[skillNameLC] = skill;
        }
    }

    roll(rollableName, emphasis = false, bonusToRoll = 0, bonusToKeep = 0, bonusToResult = 0)
    {
        return this._rollables[rollableName].roll(emphasis, bonusToRoll, bonusToKeep, bonusToResult);
    }

    toJSON()
    {
        let json = {url:this.sheetURL, traits:{}, void:this.rings.void.toJSON(), skills:{}};

        for(let trait of Object.values(this.traits))
        {
            json.traits[trait.name] = trait.toJSON();
        }
        for(let skill of Object.values(this.skills))
        {
            json.skills[skill.name] = skill.toJSON();
        }
        return json;
    }



    static async fromGoogleSheetsURL(url)
    {
        let response = await fetch(url);
        let buffer = await response.arrayBuffer();
        let document = xlsx.read(buffer);
        let baseSheet = document.Sheets[document.SheetNames[0]];
        let spellSheet = document.Sheets[document.SheetNames[1]];


        let traitRange = xlsx.utils.decode_range('B1:C12');
        let traits = {};
        for (let row = traitRange.s.r; row < traitRange.e.r; row++)
        {
            let key_cell_address = xlsx.utils.encode_cell({c: traitRange.s.c, r: row});
            let key_cell = baseSheet[key_cell_address];
            if (key_cell) {
                let value_cell_address = xlsx.utils.encode_cell({c: traitRange.e.c, r: row});
                let value_cell = baseSheet[value_cell_address];
                traits[key_cell.v] = parseInt(value_cell.v);
            }
        }

        let skillRange = xlsx.utils.decode_range('E2:H20');
        let skills = {};
        for(let row = skillRange.s.r; row < skillRange.e.r; row++)
        {
            let skill_key_cell = baseSheet[xlsx.utils.encode_cell({c:skillRange.s.c, r:row})];
            if(skill_key_cell)
            {
                let trait_key_cell = baseSheet[xlsx.utils.encode_cell({c:skillRange.s.c + 2, r:row})];
                let value_cell = baseSheet[xlsx.utils.encode_cell({c:skillRange.s.c + 3, r:row})];
                let skill = {name:skill_key_cell.v, trait:trait_key_cell.v, value:value_cell.v}
                skills[skill.name] = skill;
            }
        }

        return new Sheet(
            {
                void: baseSheet['A14'].v,
                traits: traits,
                skills:skills
            },
            url
        );
    }

}

export default Sheet;