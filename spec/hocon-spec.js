var hoconParser = require('../lib/hocon');
var expect = require('expect.js');

describe('hocon test suite', function() {
  describe('JSON subset features', function() {
    it('should be parsed using null value', function() {
      var jsonSubset = '{ "foo" : null }';
      expect(hoconParser().parse(jsonSubset)).to.be.ok();
    });

    it('should be parsed using empty string value', function() {
      var jsonSubset = '{ "foo" : "" }';
      expect(hoconParser().parse(jsonSubset)).to.be.ok();
    });

    it('should be parsed using non-empty string value', function() {
      var jsonSubset = '{ "foo" : "bar" }';
      expect(hoconParser().parse(jsonSubset)).to.be.ok();
    });

    it('should be parsed using positive number value', function() {
      var jsonSubset = '{ "foo" : 12 }';
      expect(hoconParser().parse(jsonSubset)).to.be.ok();
    });

    it('should be parsed using negative number value', function() {
      var jsonSubset = '{ "foo" : -12 }';
      expect(hoconParser().parse(jsonSubset)).to.be.ok();
    });

    it('should be parsed using true boolean value', function() {
      var jsonSubset = '{ "foo" : true }';
      expect(hoconParser().parse(jsonSubset)).to.be.ok();
    });

    it('should be parsed using false boolean value', function() {
      var jsonSubset = '{ "foo" : false }';
      expect(hoconParser().parse(jsonSubset)).to.be.ok();
    });

    it('should be parsed using empty object value', function() {
      var jsonSubset = '{ "foo" : {  } }';
      expect(hoconParser().parse(jsonSubset)).to.be.ok();
    });

    it('should be parsed using filled object value', function() {
      var jsonSubset = '{ "foo" : { "bar" : "baz" } }';
      expect(hoconParser().parse(jsonSubset)).to.be.ok();
    });

    it('should be parsed using array of strings', function() {
      var jsonSubset = '{ "foo" : [ "bar" , "baz" ] }';
      expect(hoconParser().parse(jsonSubset)).to.be.ok();
    });
  });

  describe('HOCON specific features', function(){
    it('should be parsed using = instead of : as pair separator', function() {
      var conf = '{ "a" = "b" }';
      expect(hoconParser().parse(conf)).to.be.ok();
    });

    it('should be parsed without separator if a key is followed by {', function() {
      var conf = '{ "a" { } }';
      expect(hoconParser().parse(conf)).to.be.ok();
    });

    it('should be parsed when root braces are omitted', function() {
      var conf = '"a" { }';
      expect(hoconParser().parse(conf)).to.be.ok();
    });

    it('should be parsed when exists trailing comma in arrays', function() {
      var conf = '{ "foo" : [ "bar" , "baz" , ] }';
      expect(hoconParser().parse(conf)).to.be.ok();
    });

    //it('shouldn\'t be parsed when exists two trailing commas in arrays', function() {
    //  var conf = '{ "foo" : [ "bar" , "baz" , , ] }';
    //  expect(hoconParser().parse(conf)).to.throwException();
    //});

    //it('shouldn\'t be parsed when exists initial comma in arrays', function() {
    //  var conf = '{ "foo" : [ , "bar" , "baz" ] }';
    //  expect(hoconParser().parse(conf)).to.throwException();
    //});

    it('should be parsed when exists trailing comma in objects', function() {
      var jsonSubset = '{ "foo" : { "bar" : "baz" , } }';
      expect(hoconParser().parse(jsonSubset)).to.be.ok();
    });

    //it('shouldn\'t be parsed when exists two trailing commas in objects', function() {
    //  var jsonSubset = '{ "foo" : { "bar" : "baz" , , } }';
    //  expect(hoconParser().parse(jsonSubset)).to.be.ok();
    //});

    //it('shouldn\'t be parsed when exists initial comma in objects', function() {
    //  var jsonSubset = '{ "foo" : { , "bar" : "baz" } }';
    //  expect(hoconParser().parse(jsonSubset)).to.be.ok();
    //});
  });
});
