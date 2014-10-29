var assert = require('assert');
var Sails = require('sails');
var Barrels = require('barrels');
var fixtures;

// Global before hook
before(function (done) {
  // Lift Sails with test database
  Sails.lift({
    log: {
      level: 'error'
    },
    models: {
      connection: 'test',
      migrate: 'drop'
    }
  }, function(err, sails) {
    if (err)
      return done(err);

    // Load fixtures
    var barrels = new Barrels();

    // Save original objects in `fixtures` variable
    fixtures = barrels.data;

    // Populate the DB    
    barrels.populate(function(err) {
      done(err, sails);
    });
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
      // All apples
      Apples.find(function(err, apples) {
        var gotApples = (fixtures['apples'].length > 0);
        var applesAreInTheDb = (apples.length === fixtures['apples'].length);
        assert(gotApples&&applesAreInTheDb, 'There must be something!');

        // All oranges
        Oranges.find(function(err, oranges) {
          assert.equal(apples.length, oranges.length,
            'The amount of varieties of apples and oranges should be equal!');
        }); 
      });
    });
  });
});
