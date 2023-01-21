import Sheet from './sheet.js';


let url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQKAXdcpM5P7WZYRGDp1vUGmXZ_MjJhV2LY3LR9-6Z8G8XdoTz2-DUUOaZoTla-BFTeoNfRuqYsaZpm/pub?output=xlsx"

let sheet = await Sheet.fromGoogleSheetsURL(url).catch((e)=>{
    console.log(e);
});

console.log(sheet);