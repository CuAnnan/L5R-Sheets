import Sheet from './sheet.js';
import SheetCache from './SheetCache.js';


let url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmevaQAKU6XyG-za5-6E7jSWKnTyAWD8gRP3cwxqSGEpUjtIZE_K2pa9Qxq7RDGVd_qyoajVymKPOb/pub?output=xlsx"

let sheet = await Sheet.fromGoogleSheetsURL(url).catch((e)=>{
    console.log(e);
});


SheetCache.storeSheet('1', '2', sheet);
SheetCache.storeSheet('2', '3', sheet);