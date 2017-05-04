const express = require('express');
const router = express.Router();
const {Urls, shorten, retrieve} = require('../models/urls');
const isUrl = require('valid-url').isWebUri;

router.use('/*', (req, res, next) => {
  res.type('json');
  next();
})

router.get('/retrieve/:shorturl', (req, res, next) => {
  const _id = req.params.shorturl;
  retrieve(_id)
    .then((doc) => {
      if (doc === null){
        return res.status(404).json({error: `Url matching ${_id} not found`});
      }
      res.redirect(doc.url);
    })
    .catch(next);
});

router.get('/shorten/*', (req, res, next) => {
  const url = req.params[0];

  if (!isUrl(url)) {
    return res.status(400).json({error: `${url} is not a valid url`});
  }

  shorten(url)
    .then((doc) => {
      res.json({
        url: doc.url,
        shortUrl: `http://${req.headers.host}/urls/retrieve/${doc._id}`
      });
    })
    .catch(next);
});

module.exports = router;
