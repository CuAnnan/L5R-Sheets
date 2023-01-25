'use strict';
import xlsx from 'xlsx';
import fetch from 'node-fetch';
import Pool from './Pool.js';

class Trait extends Pool
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

class Skill extends Pool
{
    constructor(name, trait, value)
    {
        super(trait.value + value, trait.value);
        this.name = name;
        this.value = value;
        this.trait = trait.name;
    }

    toJSON()
    {
        return {name:this.name, value:this.value, trait:this.trait};
    }
}

class Spell extends Pool
{
    constructor(name, ring, level, roll, keep, rollBonus, keepBonus)
    {
        super(roll, keep);
        this.ring = ring;
        this.name = name;
        this.level = level;
        this.rollBonus = rollBonus;
        this.keepBonus = keepBonus
    }

    toJSON()
    {
        return {
            name:       this.name,
            ring:       this.ring.name,
            level:      this.level,
            rollBonus:  this.rollBonus,
            keepBonus:  this.keepBonus
        }
    }
}

class Sheet {

    /**
     * A function to parse the json provided to the constructor into the stored values.
     * This method also compiles the Ring Values
     * @param traitsJSON    The value of each trait
     * @param voidValue     This is needed for the rings part
     */
    parseTraits(traitsJSON, voidValue)
    {
        this.traits = {};
        for(let traitJSON of Object.values(traitsJSON))
        {
            let trait = new Trait(traitJSON.name, traitJSON.value);
            let lcTraitName = traitJSON.name.toLowerCase();
            this.traits[lcTraitName] = trait;
            this._rollables[lcTraitName] = trait;
        }

        this.rings = {
            air: new Ring('Air', Math.min(this.traits.reflexes.value, this.traits.awareness.value)),
            earth: new Ring('Earth', Math.min(this.traits.stamina.value, this.traits.willpower.value)),
            fire: new Ring('Fire', Math.min(this.traits.agility.value, this.traits.intelligence.value)),
            water: new Ring( 'Water', Math.min(this.traits.strength.value, this.traits.perception.value)),
            void: new Ring('Void', voidValue),
        };
        for(let [ringName, ring] of Object.entries(this.rings))
        {
            this._rollables[ringName] = ring;
        }
    }

    parseSkills(skillsJSON)
    {
        this.skills = {};
        for(let skillJSON of Object.values(skillsJSON))
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
            let skillNameLC = skillJSON.name.toLowerCase();
            if(this.skills[skillNameLC] || this.traits[skillNameLC] || this.rings[skillNameLC])
            {
                throw new Error(`Duplicate field key entry ${skill.name}`)
            }

            this.skills[skillNameLC] = skill;
            this._rollables[skillNameLC] = skill;
        }
    }

    parseShugenjaDetails(shugenjaJSON)
    {
        this.spells = {};
        this.affinity = shugenjaJSON.affinity;
        this.deficiency = shugenjaJSON.deficiency? shugenjaJSON.deficiency:null;

        let spellCraftBonus = (this.skills.spellcraft && this.skills.spellcraft.value >= 5)?1:0;


        for(let spellJSON of shugenjaJSON.spells)
        {
            // constructor(name, ring, level, rank, roll, keep)
            let ring = this.rings[spellJSON.ring.toLowerCase()];

            let spell = new Spell(
                spellJSON.name,
                ring,
                spellJSON.level,
                ring.value + this.rank + spellCraftBonus + (ring.name === this.affinity ? 1 : 0) + (ring.name === this.deficiency ? -1 : 0) + spellJSON.rollBonus,
                ring.value + spellJSON.keepBonus,
                spellJSON.rollBonus,
                spellJSON.keepBonus
            );
            this.spells[spell.name.toLowerCase()] = spell;
            this._rollables[spell.name.toLowerCase()] = spell;
        }
    }


    constructor(json, sheetURL) {
        this.lastAccessed = Date.now();
        this.sheetURL = sheetURL?sheetURL:json.url;
        this._rollables = {};
        this.rank = json.rank;

        this.parseTraits(json.traits, json.void.value);
        this.parseSkills(json.skills);

        if(json.shugenja)
        {
            this.parseShugenjaDetails(json.shugenja);
        }
    }

    roll(rollableName, emphasis = false, bonusToRoll = 0, bonusToKeep = 0, bonusToResult = 0)
    {
        this.lastAccessed = Date.now();
        return this._rollables[rollableName].roll(emphasis, bonusToRoll, bonusToKeep, bonusToResult);
    }

    getPool(name)
    {
        this.lastAccessed = Date.now();
        if(this._rollables[name])
        {
            return this._rollables[name];
        }
    }

    toJSON()
    {
        let json = {rank:this.rank, url:this.sheetURL, traits:{}, void:this.rings.void.toJSON(), skills:{}};

        for(let trait of Object.values(this.traits))
        {
            json.traits[trait.name] = trait.toJSON();
        }
        for(let skill of Object.values(this.skills))
        {
            json.skills[skill.name] = skill.toJSON();
        }

        if(this.spells)
        {
            /*
            this.spells = {};
            this.affinity = shugenjaJSON.affinity;
            this.deficiency = shugenjaJSON.deficiency? shugenjaJSON.deficiency:null;
             */
            json.shugenja = {
                affinity:this.affinity
            };

            if(this.deficiency)
            {
                json.shugenja.deficiency = this.deficiency;
            }
            json.shugenja.spells = [];
            for(let spell of Object.values(this.spells))
            {
                json.shugenja.spells.push(spell.toJSON());
            }
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
        let extraSkillsSheet = document.Sheets[document.SheetNames[2]];
        let traits = {};
        let skills = {};
        let shugenjaStuff = {};

        try
        {
            let traitRange = xlsx.utils.decode_range('B1:C12');
            for (let row = traitRange.s.r; row < traitRange.e.r; row++) {
                let key_cell_address = xlsx.utils.encode_cell({c: traitRange.s.c, r: row});
                let key_cell = baseSheet[key_cell_address];
                if (key_cell) {
                    let value_cell_address = xlsx.utils.encode_cell({c: traitRange.e.c, r: row});
                    let value_cell = baseSheet[value_cell_address];
                    traits[key_cell.v] = {name: key_cell.v, value: parseInt(value_cell.v)};
                }
            }
        }
        catch(e)
        {
            throw new Error('There was a problem loading your traits');
        }

        try
        {
            let skillRange = xlsx.utils.decode_range('E2:H21');
            for (let row = skillRange.s.r; row < skillRange.e.r; row++) {
                let skill_key_cell = baseSheet[xlsx.utils.encode_cell({c: skillRange.s.c, r: row})];
                if (skill_key_cell) {
                    let trait_key_cell = baseSheet[xlsx.utils.encode_cell({c: skillRange.s.c + 2, r: row})];
                    let value_cell = baseSheet[xlsx.utils.encode_cell({c: skillRange.s.c + 3, r: row})];
                    let skill = {name: skill_key_cell.v, trait: trait_key_cell.v, value: value_cell.v}
                    skills[skill.name] = skill;
                }
            }
        }
        catch(e)
        {
            throw new Error('There was a problem loading your page1 skills')
        }

        try
        {
            let row = 2;
            let extraSkillCell = extraSkillsSheet[`A${row}`];
            let extraSkillTrait = extraSkillsSheet[`C${row}`];
            let extraSkillValue = extraSkillsSheet[`D${row}`];
            while(extraSkillCell && extraSkillTrait && extraSkillValue)
            {
                let skill = {name:extraSkillCell.v, trait:extraSkillsSheet[`C${row}`].v, value:extraSkillValue.v};
                skills[skill.name] = skill;
                row++;
                extraSkillCell = extraSkillsSheet[`A${row}`];
                extraSkillTrait = extraSkillsSheet[`C${row}`];
                extraSkillValue = extraSkillsSheet[`D${row}`];
            }
        }
        catch(e)
        {
            throw new Error('There was a problem loading your page 3 skills');
        }

        try
        {
            let shugenjaAffinityRingCell = spellSheet['C1'];
            if (shugenjaAffinityRingCell) {
                shugenjaStuff.spells = [];
                shugenjaStuff.affinity = shugenjaAffinityRingCell.v;
                let deficiencyRingCell = spellSheet['E1'];
                // Phoenix Shugenja don't have deficiencies.
                if (deficiencyRingCell) {
                    shugenjaStuff.deficiency = deficiencyRingCell.v;
                }

                let spellRange = xlsx.utils.decode_range('B3:H3');
                let address = {c: spellRange.s.c, r: spellRange.s.r}
                let currentSpellNameCell = spellSheet[xlsx.utils.encode_cell(address)];


                while (currentSpellNameCell) {
                    let rollBonusCell = spellSheet[xlsx.utils.encode_cell({c: address.c + 3, r: address.r})];
                    let keepBonusCell = spellSheet[xlsx.utils.encode_cell({c: address.c + 4, r: address.r})];
                    let spellJSON = {
                        name: currentSpellNameCell.v,
                        ring: spellSheet[xlsx.utils.encode_cell({c: address.c + 1, r: address.r})].v,
                        level: parseInt(spellSheet[xlsx.utils.encode_cell({c: address.c + 2, r: address.r})].v),
                        rollBonus: rollBonusCell ? parseInt(rollBonusCell.v) : 0,
                        keepBonus: keepBonusCell ? parseInt(keepBonusCell.v) : 0,
                    }
                    shugenjaStuff.spells.push(spellJSON);
                    spellRange.s.r++;
                    spellRange.e.r++;
                    address = {c: spellRange.s.c, r: spellRange.s.r}
                    currentSpellNameCell = spellSheet[xlsx.utils.encode_cell(address)];
                }
            }
        }
        catch(e)
        {
            throw new Error('There was a problem loading your Shugenja sheet');
        }

        try
        {
            return new Sheet(
                {
                    void: {value: baseSheet['A14'].v},
                    traits: traits,
                    skills: skills,
                    rank: parseInt(baseSheet['N4'].v),
                    shugenja: shugenjaStuff
                },
                url
            );
        }
        catch(e)
        {
            throw new Error('There was a problem reading either your void or rank');
        }
    }

}

export default Sheet;