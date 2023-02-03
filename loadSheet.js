import Sheet from './sheet.js';
import mongoClient from './db.js';
import SheetCache from './SheetCache.js';

let db = mongoClient.db('l5r');

export default async function(guildId, userId)
{
    let sheet = SheetCache.getSheet(guildId, userId);
    if(!sheet)
    {
        let sheetDocument = await db.collection('sheets').findOne({userId:userId, guildId:guildId});
        if(!sheetDocument)
        {
            return;
        }
        let sheetJSON = sheetDocument.sheet;
        sheet = new Sheet(sheetJSON);
        SheetCache.storeSheet(guildId, userId, sheet);
    }
    return sheet;
}