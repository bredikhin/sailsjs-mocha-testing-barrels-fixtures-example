# How do I test my Sails.js application?

[![Build Status](https://travis-ci.org/bredikhin/sailsjs-mocha-testing-barrels-fixtures-example.png?branch=master)](https://travis-ci.org/bredikhin/sailsjs-mocha-testing-barrels-fixtures-example)
[![Dependency Status](https://gemnasium.com/bredikhin/sailsjs-mocha-testing-barrels-fixtures-example.png)](https://gemnasium.com/bredikhin/sailsjs-mocha-testing-barrels-fixtures-example)

Nowadays, testing became an essential part of the modern software development
process. However, the tools we're using for development often define some
particularities in the testing setup. In this example we'll learn to write
unit and functional tests for your [Sails.js](http://sailsjs.org/) application.

## Database Connection

First, define a connection to your test database. It can be as simple as adding

```javascript
  test: {
    adapter: 'sails-memory'
  }
```

to the `module.exports.connections` object in `./config/connections.js`. Which
adapter you'll be using depends on how complex your application (and, hence,
tests) is: in simplest cases `sails-memory` can work just fine, but in more
complex situations you may have to create a separate Mongo (or whatever else
you're using) database.

## Add Dependencies

Use `npm i --save-dev <package>` to add testing dependencies to your project.

In this example we're using the following packages:

* [Mocha](https://github.com/mochajs/mocha) as the testing framework;
* [Should.js](https://github.com/shouldjs/should.js) as the assertion library;
* [Sails-memory](https://github.com/balderdashy/sails-memory) as the test database engine;
* [Supertest](https://github.com/tj/supertest) for functional testing;
* [Barrels](https://github.com/bredikhin/barrels) for database fixtures.

Feel free to use these or replace them with your own favorites.

## Test Command

Add your test command to the `scripts` section of `package.json`. In our
case it'll be:

```json
  ...
  "scripts": {
    ...
    "test": "PORT=9999 NODE_ENV=test mocha -R spec -b --recursive"
  },
  ...
```

Here we are lifting our test Sails application on a non-standard port in case
you'd like to run tests while the development version of your application is
still running.

## Write Your Tests

Finally, we got to the step where we have to write some tests. But first
we are going to need our Sails application to be lifted while running the
tests.

### Bootstrapping

Let's create a `./test` folder (if it doesn't exist yet) and put a file
named `bootstrap.test.js` in it. This file will contain global hooks for
setting up and tearing down our test environment. With Mocha, it will be
something like that:

```javascript
  var Sails = require('sails');

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
    }, function(err) {
      if (err)
        return done(err);

      // Anything else you need to set up
      // ...

      done();
    });
  });

  // Global after hook
  after(function (done) {
    console.log(); // Skip a line before displaying Sails lowering logs
    Sails.lower(done);
  });
```

Don't hesitate to add to these hooks any other steps specific to your
application.

### Unit Tests for Your Models

Given the setup we got, we can place our tests anywhere within the `./test`
folder. However, it makes sense to organize them in a structure similar to
the one of our application.

Thus, skipping the `api` folder (as more or less all the code we are supposed
to be testing resides within `./api`), we can put our model unit tests in
`./test/models`.

For example, if we are testing a model called `Apples`, we could put something
like this in `./test/models/Apples.test.js`:

```javascript
  describe('Apples', function() {
    it ('should not be empty', function(done) {
      Apples.find().exec(function(err, apples) {
        apples.length.should.not.be.eql(0);

        done();
      });
    });
  });
```

## Fixtures

The example in the previous section assumes that the test database contains
some data already. But if it gets dropped every time the tests finish
(which is the case when `sails-memory` adapter is being used), you might want
to initialize your test database with some fixture data before you start
testing. There is a lot of ways to do it, but the idea is that you have to
populate your tables / collections in the global `before` hook we put in
`./test/bootstrap.test.js`:

```javascript
  before(function (done) {
    Sails.lift({
      log: {
        level: 'error'
      },
      models: {
        connection: 'test',
        migrate: 'drop'
      }
    }, function(err) {
      if (err)
        return done(err);

      // Load fixtures
      var barrels = new Barrels();

      // Populate the DB
      barrels.populate(function(err) {
        done(err);
      });
    });
  });
```

In this example we are using [Barrels](https://github.com/bredikhin/barrels)
package, which reads fixture data from JSON files in a specified path
(`./test/fixtures` by default) and populates the corresponding database
collections. Obviously, you can use any other fixture library or just
populate the test data in your own way, but the point is that `before`
hook is the place to do it.

### Functional Tests for Controllers

Even though most of your code is supposed to reside within the models, writing
functional tests for controllers is an important part of making your API
solid and maintainable.

Following the convention we started with the model tests, let's put our code
in `./test/controllers/ApplesController.test.js`:

```javascript
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
```

In this (very basic) example we only check the status code, but, of course,
you are free to do a more complex analysis of the response. Check out the
[Supertest API](https://github.com/tj/supertest) for more helpers and
assertions.

## Conclusion

[Sails.js](http://sailsjs.org/) is a very powerful tool that can help you
create APIs in almost no time. Still, if you have long term goals for your
application, having properly written tests for your code is highly
recommended. Here, we looked at some aspects of writing such tests and
listed several useful packages that could help you, but feel free to add
your own components, experiment with other testing frameworks or assertion
libraries.

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2013-2015 [Ruslan Bredikhin](http://ruslanbredikhin.com/)
