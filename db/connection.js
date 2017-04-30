'use strict';

const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient();
const connection = client.connect(process.env.DB_URI);

module.exports = connection;
