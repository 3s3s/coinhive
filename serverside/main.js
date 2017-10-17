'use strict';

const http = require('https');
const https = require('https');
const fs = require("fs");

var express = require('express');
var app = express();

var bodyParser = require('body-parser');

const cert = '/etc/letsencrypt/live/mc-ex.multicoins.org-0001/fullchain.pem';
const key = '/etc/letsencrypt/live/mc-ex.multicoins.org-0001/privkey.pem';


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    next();
});

// your express configuration here

var httpServer = process.env.PORT ? 
  http.createServer(app) : 
  https.createServer({key: fs.readFileSync(key), cert: fs.readFileSync(cert)}, app);

httpServer.listen(process.env.PORT || 19443);

app.use(express.static('..'));
app.set('view engine', 'ejs');

require('./reqHandler.js').handle(app);

process.on('uncaughtException', function (err) {
  console.error(err.stack);
  console.log("Node NOT Exiting...");
});

app.use(function (err, req, res, next) {
    res.send(500, 'Something broke!');
});


