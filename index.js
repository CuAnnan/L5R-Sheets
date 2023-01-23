import FaW from './fortune-and-winds.js';
/*import Sheet from './sheet.js';
//import SheetCache from './SheetCache.js';
import mongoClient from "./db.js";




//let url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmevaQAKU6XyG-za5-6E7jSWKnTyAWD8gRP3cwxqSGEpUjtIZE_K2pa9Qxq7RDGVd_qyoajVymKPOb/pub?output=xlsx"

mongoClient.connect().then(async function(){
    let db = mongoClient.db('l5r');
    let searchQry = {"guildId": "1066277254226784337","userId": "199648222870896641"};
    let sheetDocument = await db.collection('sheets').findOne(searchQry);
    new Sheet(sheetDocument.sheet);
    mongoClient.close().then(()=>{
        console.log('Done');
    });
});



// let sheet = await Sheet.fromGoogleSheetsURL(url).catch((e)=>{
//     console.log(e);
// });

//console.log(sheet.toJSON());
 */

let faw = new FaW();

for(let i = 0; i < 100; i++)
{
    let roll = faw.roll();
    console.log(roll);
    let hand = faw.getHand();
    console.log(hand);
    console.log(FaW.checkHand(hand).payout);
}