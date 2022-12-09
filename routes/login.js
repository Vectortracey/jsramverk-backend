var express = require('express');
var router = express.Router();
//var config = require("../db/config.json");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let database = require('../db/database');

const jwtSecret = `${process.env.JWT_SECRET}`


// POST ROUTER FOR LOGIN
router.post("/", async (req, res) => {
    let db = await database.getDb();
    const user = await db.collection.findOne({$or:[{email: req.body.email}]});

    if (user) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/login",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            if (result) {
                let payload = { email: user.email };
                let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

                return res.json({
                    data: {
                        type: "success",
                        message: "User logged in",
                        user: payload,
                        token: jwtToken
                    }
                });
            }

            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Wrong password",
                    detail: "Password is incorrect."
                }
            });
        });
    } else {
        return res.status(401).json({
            errors: {
                status: 401,
                source: "/login",
                title: "User not found",
                detail: "User with provided email not found."
            }
        });
    }

})

module.exports = router;