const mongo = require("mongodb").MongoClient;
const collectionName = "document";


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
