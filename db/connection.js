'use strict';
require('../config/env');
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient();
const connection = client.connect(process.env.DB_URI);

connection
.catch(console.log);

module.exports = connection;
