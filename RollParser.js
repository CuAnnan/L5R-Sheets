'use strict';

import Sheet from './sheet.js';
import mongoClient from './db.js';
import SheetCache from './SheetCache.js';
import Pool from './Pool.js';

let db = mongoClient.db('l5r');


async function processSheetBasedRoll(toRoll, guildId, userId)
{
    let sheet = SheetCache.getSheet(guildId, userId);
    if(!sheet)
    {
        let sheetDocument = await db.collection('sheets').findOne({userId:userId, guildId:guildId});
        let sheetJSON = sheetDocument.sheet;
        if(!sheetJSON)
        {
            throw new Error('No sheet could be found for user');
        }
        sheet = new Sheet(sheetJSON);
        SheetCache.storeSheet(guildId, userId, sheet);
    }
    console.log(`Getting pool for ${toRoll}`);
    console.log(sheet.getPool(toRoll));

    return sheet.getPool(toRoll);
}

function processArguments(parts)
{
    let args = {emphasis:false, bonusToRoll:0, bonusToKeep:0, bonusToResult:0, reroll10s:true, rerollValue:10};
    let extraResponseParts = [];
    for(let part of parts)
    {
        part = part.trim();
        if(part === '!no10s' || part === "!nr")
        {
            args.reroll10s=false;
        }
        else if(part === '!e')
        {
            args.emphasis = true;
        }
        else if(part.startsWith('!rv'))
        {
            args.rerollValue = parseInt(part.substring(3));
        }
        else
        {
            let bonusnKm = part.match(/\+(\d+)k(\d+)/);
            if(bonusnKm)
            {
                args.bonusToRoll = parseInt(bonusnKm[1]);
                args.bonusToKeep = parseInt(bonusnKm[2]);
            }
            else
            {
                let bonusAmount = part.match(/\+(\d+)/);
                if(bonusAmount)
                {
                    args.bonusToResult = parseInt(bonusAmount[1]);
                }
                else
                {
                    extraResponseParts.push(`I do not know how to process ${part}`);
                }
            }
        }
    }
    return [args, extraResponseParts];
}



async function rollParser(stringToParse, guildId, userId)
{
    console.log(stringToParse);
    let parts = stringToParse.split(' ');
    let toRoll = parts.shift();
    let pool;
    let roll;

    let basicRoll = toRoll.match(/^(\d+)k(\d+)/)
    if(basicRoll)
    {
        pool = new Pool(parseInt(basicRoll[1]), parseInt(basicRoll[2]));
        //roll(emphasis= false, bonusToRoll = 0, bonusToKeep = 0, bonusToResult = 0, reroll10s = true, rerollValue = 10)
    }
    else
    {
        // keep adding words to toRoll unless we get something that's an argument, then we stop.
        let searching = true;
        while(searching)
        {
            if(!parts.length || parts[0].startsWith('!') || parts[0].startsWith('+') || parts[0].startsWith('-'))
            {
                searching = false;
            }
            else
            {
                toRoll += ' ' + parts.shift();
            }
        }
        try
        {
            pool = await processSheetBasedRoll(toRoll.toLowerCase(), guildId, userId);
            if(!pool)
            {
                return `I could not find a pool for ${toRoll} on your sheet.`;
            }
        }
        catch(e)
        {
            console.log(e);
            return 'There was a problem fetching your sheet from the system. Have you run the /fetch-sheet command?'
        }
    }

    let [args, extraResponseParts] = processArguments(parts);

    if(pool)
    {
        roll = pool.roll(args.emphasis, args.bonusToRoll, args.bonusToKeep, args.bonusToResult, args.reroll10s, args.rerollValue);
    }

    let response;

    if(roll)
    {
        response = `You rolled ${roll.toRoll}k${roll.toKeep}${roll.bonus?`+${roll.bonus}`:''}.\n${roll.diceRolled}\nResult: ${roll.result}`;
    }

    if(extraResponseParts)
    {
        for(let responsePart of extraResponseParts)
        {
            response += `\nI don't know how to process ${responsePart}`;
        }
    }

    return response;
}

export default rollParser;