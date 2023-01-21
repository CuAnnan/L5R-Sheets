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

    roll(emphasis)
    {
        let diceRolled = [];
        for(let i = 0; i < this.toRoll; i++)
        {
            diceRolled.push(Die.roll(true, emphasis));
        }
        let sortedDice = diceRolled.sort();
        let result = 0;
        for(let i = 0; i < this.toKeep; i++)
        {
            result += sortedDice[i];
        }
        return {result:result, diceRolled:diceRolled, toRoll:this.toRoll, toKeep:this.toKeep}
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
}


class Sheet {
    constructor(json) {
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
            let skillNameLC = skill.name.toLowerCase();
            if(this.skills[skillNameLC] || this.traits[skillNameLC] || this.rings[skillNameLC])
            {
                throw new Error(`Duplicate field key entry ${skill.name}`)
            }

            this.skills[skillNameLC] = skill;
            this._rollables[skillNameLC] = skill;
        }
    }

    roll(rollableName)
    {
        return this._rollables[rollableName].roll();
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


        let traitRange = xlsx.utils.decode_range('C2:D13');
        let traits = {};
        for (let row = traitRange.s.r; row < traitRange.e.r; row++)
        {
            let key_cell = baseSheet[xlsx.utils.encode_cell({c: traitRange.s.c, r: row})];
            if (key_cell) {
                let value_cell = baseSheet[xlsx.utils.encode_cell({c: traitRange.e.c, r: row})];
                traits[key_cell.v] = parseInt(value_cell.v);
            }
        }

        let skillRange = xlsx.utils.decode_range('F3:I22');
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

        let sheet = new Sheet({
            void: baseSheet['B15'].v,
            traits: traits,
            skills:skills
        });

        return sheet;
    }

}

export default Sheet;