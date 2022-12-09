const mongo = require("mongodb").MongoClient;
// const config = require("./config.json");
const collectionName = "document";

let config;
let username;
let password;
/*
try {
    config = require("./config.json");
} catch (e) {
    console.log(e);
}

username = process.env.USERNAME || config.username;
password = process.env.PASSWORD || config.password;
*/

const database = {
    getDb: async function getDb () {
        let dsn = `mongodb+srv://texteditor:123@cluster0.migjq.mongodb.net/document?retryWrites=true&w=majority`;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test" ;
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;
