chai = void 0;
//var sails;
expect = void 0;

module.exports = function () {
  return {
    files: ['api/**/*.js', 'config/**/*.js'],
    tests: ['test/unit/**/*.test.js'],
    bootstrap: function (wallaby) {
      wallaby.delayStart();
      //return new Promise(function (resolve, reject) {
      wallaby.testFramework.ui('bdd');
      Sails = require('sails');
      //console.log(JSON.stringify(Sails));
      //Sails.adapters['sails-memory'] = require('sails-memory');
      //global.sails = Sails()
      //chai = require('chai');
      //expect = chai.expect
      var Barrels = require('barrels');
      // Lift Sails with test database
      global.sails = Sails.lift({
        log: {
          level: 'info'
        },
        models: {
          connection: 'test',
          migrate: 'drop'
        }
      }, function (err, sails) {
        if (err) {
          wallaby.start();
          return reject(err);
        }

        // Load fixtures
        var barrels = new Barrels();

        // Save original objects in `fixtures` variable
        fixtures = barrels.data;

        // Populate the DB
        barrels.populate(function (err) {
          global.sails = sails
          done(err, sails);
          wallaby.start();
        });
      });
      //});
    },
    env: {
      type: 'node'
    }
    //debug: true
  };
};
