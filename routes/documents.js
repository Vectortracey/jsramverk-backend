var express = require('express');
var router = express.Router();

let database = require('../db/database');


// GET ROUTER
router.get("/", async (req, res) => {
    let db = await database.getDb();
    const resultSet = await db.collection.find({}, {}).toArray();

    res.json(resultSet);
});


// POST ROUTER
router.post("/", async (req, res) => {
    let doc = {
        name: req.body.name,
        text: req.body.text
    }

    let db = await database.getDb();
    result = await db.collection.insertOne(doc);

    if (result.acknowledged) {
        return res.status(201).send(`Added an object with id ${result.insertedId}`);
    }
})


// PUT ROUTER
router.put("/:id", async (req, res) => {
    const ObjectId = require('mongodb').ObjectId;
    let filter = {_id: ObjectId(req.params.id)};
    let doc = {
        name: req.body.name,
        text: req.body.text
    }

    let db = await database.getDb();
    result = await db.collection.updateOne(
        filter,
        {$set: doc},
    );

    if (result.acknowledged) {
        return res.status(204).send();
    }
})

module.exports = router;
