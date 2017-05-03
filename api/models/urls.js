const sum = require('hash-sum');
const {Collection} = require('../../db');
const normalize = require('normalize-url');

const Urls = new Collection('urls');

const normalizeOpts = {
  stripWWW: true,
  normalizeHttps: true,
  removeDirectoryIndex: [/^index\.[a-z]+$/, /^default\.[a-z]+$/]
};

function shorten(url) {
  const normalizedUrl = normalize(url, normalizeOpts);
  return Urls.findOne({normalizedUrl})
    .then((doc) => {
      if (doc === null) {
        return Urls.insertOne({_id: sum(url), url, normalizedUrl})
          .then((results) => {
            return results.ops[0]._id;
          });
      } else {
        return doc._id;
      }
    });
}

function retrieve(_id) {
  return Urls.findOne({_id})
    .then((doc) => {
      if (doc !== null) {
        return doc.url;
      }
      return null;
    });
}

module.exports = {
  Urls,
  shorten,
  retrieve
};
