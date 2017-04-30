
const {Collection} = require('../../db')
const Urls = new Collection('urls');

function shorten(url) {
  return Urls.findOne({url})
    .then((doc) => {
      if (doc === null){
        return Urls.insertOne({_id: sum(url), url})
          .then((results) => {
            return results.ops[0]._id;
          })
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
