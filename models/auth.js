const jwt = require('jsonwebtoken');
const config = require('../db/config.json');
//process.env.JWT_SECRET
//`${process.env.JWT_SECRET}`
const jwtSecret = `${process.env.JWT_SECRET}`
const auth = {
    checkToken: function(req, res, next) {
        const token = req.headers['x-access-token'];
console.log(process.env.JWT_SECRET)

        if (token) {
            jwt.verify(token, jwtSecret, function(err, decoded) {
                if (err) {
                    console.log("fel här")
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: req.path,
                            title: "Failed authentication",
                            detail: err.message
                        }
                    });
                }

                req.user = {};
                req.user.email = decoded.email;

                return next();
            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: req.path,
                    title: "No token",
                    detail: "No token provided in request headers"
                }
            });
        }
    }
}

module.exports = auth;