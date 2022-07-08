"use strict";
const port = process.env.PORT || 1337;
const express = require("express");
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const documents = require('./routes/documents');
const { log } = require("console");


const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"]
    }
});

io.on('connection', function(socket) {
    let lastId;
    socket.on('create', function(room) {
        socket.leave(lastId);
        socket.join(room);
        console.log(room)
        lastId = room;
        socket.on("doc", function(data) {
            socket.to(data["_id"]).emit("doc", data);
            console.log(data)
        });
    });
});



app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
})

app.use('/', index);
app.use('/documents', documents);


// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use((req, res, next) => {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
})

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title": err.title,
                "details": err.message
            }
        ]
    });
})

const server = httpServer.listen(port);

module.exports = server;