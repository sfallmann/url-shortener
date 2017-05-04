const sum = require('hash-sum');
const normalize = require('normalize-url');
const expect = require('expect');
const request = require('supertest');
const {Urls, shorten, retrieve}  = require('../models/urls');
const {app} =  require('../../server');


const normalizeOpts = {
  stripWWW: true,
  normalizeHttps: true,
  removeDirectoryIndex: [/^index\.[a-z]+$/, /^default\.[a-z]+$/]
};

after((done) => {
  Urls
    .drop()
    .then(() => {
      done();
    })
    .catch(done);
});

const url1 = 'https://www.test.com/index.html';
const url2 = 'http://test.com/';


describe('api.models.urls.shorten', (done) => {

  it('should have an id equal to the sum hash of the normalized url', (done) => {
    shorten(url1)
      .then((doc) => {
        expect(doc._id).toBe(sum(normalize(url1, normalizeOpts)));
        done();
      })
      .catch(done);
  });

  it('should not create a new document if it already exists', (done) => {
    Urls.find({}).toArray()
    .then((docs) => {
      expect(docs.length).toBe(1);
      done();
    });
  });

  it('should not create a new document for a different url if the normalized url is the same', (done) => {
    expect(normalize(url1, normalizeOpts)).toBe(normalize(url2, normalizeOpts));
    shorten(url2)
      .then((doc) => {
        return Urls.find({}).toArray();
      })
    .then((docs) => {
      expect(docs.length).toBe(1);
      done();
    })
    .catch(done);

  });

});

describe('api.models.urls.retrieve', (done) => {

  it('should retrieve the url from the _id (sum hash)', (done) => {
    retrieve(sum(normalize(url1, normalizeOpts)))
      .then((doc) => {
        expect(doc.url).toBe((normalize(url1, normalizeOpts)));
        done();
      })
      .catch(done);
  });

});

describe('GET /urls/retrieve', (done) => {

  it('should return 404 if the id can\'t be found', (done) => {
    const shorturl = sum('https://adifferentsite.com');
    request(app)
      .get(`/urls/retrieve/${shorturl}`)
      .expect('Content-Type', /json/)
      .expect(404, done);
  });

  it('should redirect to the normalized url', (done) => {
    const shorturl = sum(normalize(url1, normalizeOpts));
    request(app)
      .get(`/urls/retrieve/${shorturl}`)
      .expect((res) => {
        expect(res.headers.location).toBe(normalize(url1, normalizeOpts));
      })
      .expect(302, done);
  });

});

describe('GET /urls/shorten', (done) => {

  it('should reject a poorly formed url', (done) => {
    request(app)
      .get('/urls/shorten/www.test.com')
      .expect('Content-Type', /json/)
      .expect(400, done);
  });

  it('should return the original link and the shortened link', (done) => {
    const google = 'https://google.com';
    const shorturl = sum(normalize(google, normalizeOpts));
    request(app)
      .get(`/urls/shorten/${google}`)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body.url).toBe(normalize(google, normalizeOpts));
        expect(res.body.shortUrl.indexOf(shorturl)).toBeGreaterThan(-1);
      })
      .expect(200, done);
  });

});
