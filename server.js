require('./config/env');

const express = require('express');
const app = express();
const urls = require('./api/routes/urls');
const port = process.env.PORT || 3000;

app.use('/urls', urls);
app.use((err, req, res, next) => {
  // Real error logging\handling should go here
  console.log(err);
})

app.listen(port);
