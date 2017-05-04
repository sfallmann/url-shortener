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
  return Urls.findOne({url: normalizedUrl})
    .then((doc) => {
      if (doc === null) {
        return Urls.insertOne({_id: sum(normalizedUrl), url: normalizedUrl})
          .then((results) => {
            return results.ops[0];
          });
      } else {
        return doc;
      }
    });
}

function retrieve(_id) {
  return Urls.findOne({_id})
    .then((doc) => {
      if (doc !== null) {
        return doc;
      }
      return null;
    });
}

module.exports = {
  Urls,
  shorten,
  retrieve
};
