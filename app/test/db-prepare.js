const database = require("../models/index.js");

const databaseMethods = {
  tearDown: async function () {
    const db = await database.getDb();
    db.db
      .listCollections({ name: "docstest" })
      .next()
      .then(async function (info) {
        if (info) {
          await db.collection.drop();
        }
      })
      .catch(function (err) {
        console.error(err);
      })
      .finally(async function () {
        await db.client.close();
        resolve();
      });
  },
  create: async function () {
    const db = await database.getDb();
    // create a document for insertion
    const doc = {
      title: "Test Title",
      content: "Test Content",
    };
    // insert document and create collection db.collection
    let result = await db.collection.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
    // get all content
    let res = await db.collection.find({}).toArray();

    return res;
  },
  get: async function () {
    const db = await database.getDb();
    // get all entries
    let res = await db.collection.find({}).toArray();

    return res;
  },
};

module.exports = databaseMethods;
