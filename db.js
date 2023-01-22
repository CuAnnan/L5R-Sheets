import {MongoClient} from 'mongodb';
import fs from "fs";
const jsonFile = fs.readFileSync('./config.json').toString();
const conf = JSON.parse(jsonFile);

let userStuff = '';
if(conf.mongo)
{
    userStuff = `${conf.mongo.user}:${encodeURIComponent(conf.mongo.password)}@`;
}

let mongoUrl = `mongodb://${userStuff}localhost:27017/l5r?directConnection=true`;
console.log(mongoUrl);

let mongoClient = new MongoClient(mongoUrl);

console.log('Checking for mongo instance');

mongoClient.connect().then(function(){
    console.log('Connected');
});

export default mongoClient;