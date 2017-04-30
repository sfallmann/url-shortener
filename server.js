require('./config/env');

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const sum = require('hash-sum');
const {Urls, shorten} = require('./api/models/url');
