var request = require('supertest');

describe('ApplesController', function() {
  describe('index', function() {
    it('should return success', function (done) {
      request(sails.hooks.http.app)
        .get('/apples')
        .expect(200, done);
    });
  });

});
