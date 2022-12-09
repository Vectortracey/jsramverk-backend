var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');

let database = require('../db/database');


// POST ROUTER FOR REGISTER
router.post("/", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/register",
                title: "Email or password missing",
                detail: "Email or password missing in request"
            }
        });
    }

    bcrypt.hash(password, 4, async function(err, hash) {
        if (err) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/register",
                    title: "bcrypt error",
                    detail: "bcrypt error"
                }
            });
        }

        let db;

            try {
                db = await database.getDb();

                let doc = {
                    email: email,
                    password: hash,
                }

                await db.collection.insertOne(doc);

                return res.status(201).json({
                    data: {
                        message: "User successfully registered."
                    }
                });
            } catch (e) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "Database error",
                        detail: err.message
                    }
                });
            } finally {
                await db.client.close();
            }
        });
})

module.exports = router;