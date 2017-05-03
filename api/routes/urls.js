const express = require('express');
const router = express.Router();
const {Urls, shorten, retrieve} = require('../models/urls');
const isUrl = require('valid-url').isWebUri;

router.get('/retrieve/:shorturl', (req, res, next) => {
  const _id = req.params.shorturl;

  retrieve(_id)
    .then((url) => {
      if (url === null){
        return res.status(404).json({error: `Url matching ${_id} not found`});
      }
      res.redirect(url);
    })
    .catch(next);
});

router.get('/shorten/*', (req, res, next) => {
  const url = req.params[0];

  if (!isUrl(url)) {
    return res.json({error: `${url} is not a valid url`});
  }

  shorten(url)
    .then((shorturl) => {
      res.json({url, shortUrl: `http://${req.headers.host}/urls/retrieve/${shorturl}`});
    })
    .catch(next);
});

module.exports = router;
