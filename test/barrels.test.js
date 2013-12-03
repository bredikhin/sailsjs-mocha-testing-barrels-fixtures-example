var assert = require('assert')
  , Sails = require('sails')
  , barrels = require('barrels')
  , fixtures;

// Global before hook
before(function (done) {
  Sails.lift({
    log: {
      level: 'error'
    },
    adapters: {
      default: 'test'
    }
  }, function(err, sails) {
    if (err) return done(err);
    fixtures = barrels.populate(function(err) {
      done(err, sails);
    }).objects;
  });
});

// Global after hook
after(function (done) {
  console.log();
  sails.lower(done);
});

// Here goes a module test
describe('Fruits', function() {
  describe('#list()', function() {
    it ('should list the sorts of apples and oranges', function() {
      Apples.find(function(err, apples) {
        var gotApples = (fixtures['apples'].length > 0);
        var applesAreInTheDb = (apples.length === fixtures['apples'].length);
        assert(gotApples&&applesAreInTheDb, 'There must be something!');

        Oranges.find(function(err, oranges) {
          assert.equal(apples.length, oranges.length,
            'The amount of sorts of apples and oranges should be equal!');
        }); 
      });
    });
  });
});
