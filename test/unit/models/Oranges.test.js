describe('Oranges', function() {
  it ('should have the same amount of documents as in fixtures', function(done) {
    Oranges.find().exec(function(err, oranges) {
      fixtures['oranges'].length.should.be.greaterThan(0);
      oranges.length.should.be.eql(fixtures['oranges'].length);

      done();
    });
  });
});
