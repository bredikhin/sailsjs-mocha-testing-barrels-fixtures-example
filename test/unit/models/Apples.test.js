describe('Apples', function() {
  it ('should not be empty', function(done) {
    Apples.find().exec(function(err, apples) {
      apples.length.should.be.eql(fixtures['apples'].length);

      done();
    });
  });
});
