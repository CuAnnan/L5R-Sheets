import {MongoClient} from 'mongodb';

let mongoClient = new MongoClient('mongodb://localhost:27017/l5r');
let db = null;

console.log('Checking for mongo instance');

mongoClient.connect().then(function(){
    console.log('Connected');
});

export default mongoClient;