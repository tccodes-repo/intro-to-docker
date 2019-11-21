const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = 3000
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 1025
});


// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'compose';

// Create a new MongoClient
const client = new MongoClient(url);

const asyncRoute = route => (req, res, next = console.error) =>
  Promise.resolve(route(req, res)).catch(next)
 
// Use connect method to connect to the Server
client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    app
        .use(bodyParser.json())
        .use(express.static('public'))
        .get('/sent', getSent(db))
        .post('/send', asyncRoute(sendEmail(db)))
        .listen(port, () => console.log(`Example app listening on port ${port}!`));
});


function sendEmail(db) {
   return async function(req, res) {
        const collection = db.collection('sent');

        console.log('Sending data to: ', req.body);

        const message = {
            from: 'system@20fathoms.org',
            to: req.body.sendTo,
            subject: 'Hello from Tccodes!',
            text: 'This is a test email from Tccodes'
        };

        transport.sendMail(message, function(err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log(info);
            }
        });

        await collection.insertOne({
            to: req.body.sendTo,
            dateSent: new Date(),    
        });

        res.json({});
        res.end();
   }
}

function getSent(db) {
    return function(req, res) {
        const collection = db.collection('sent');

        collection.find({}).toArray(function(err, docs) {
            res.json(docs);
            res.end();
        });
    }
}

