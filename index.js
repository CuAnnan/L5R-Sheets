//import FaW from './fortune-and-winds.js';
import Sheet from './sheet.js';
// import SheetCache from './SheetCache.js';
// import mongoClient from "./db.js";
import hash from 'object-hash';




let url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSuLeQlNQeAnwTcveeqZgkAr0KgVFL8uhI7i3OMCI3W4_jgAE7fP7Yeq08buhs-1hRDByABfrJvYVMS/pub?output=xlsx"

// mongoClient.connect().then(async function(){
//     let db = mongoClient.db('l5r');
//     let searchQry = {"guildId": "1066277254226784337","userId": "199648222870896641"};
//     let sheetDocument = await db.collection('sheets').findOne(searchQry);
//     new Sheet(sheetDocument.sheet);
//     mongoClient.close().then(()=>{
//         console.log('Done');
//     });
// });



let sheet1 = await Sheet.fromGoogleSheetsURL(url).catch((e)=>{
    console.log(e);
});
let sheet2 = new Sheet(sheet1.toJSON());

console.log(hash(sheet1.toJSON()));
console.log(hash(sheet2.toJSON()));

//
// let faw = new FaW();
//
// for(let i = 0; i < 100; i++)
// {
//     let roll = faw.roll();
//     console.log(roll);
//     let hand = faw.getHand();
//     console.log(hand);
//     console.log(FaW.checkHand(hand).payout);
// }