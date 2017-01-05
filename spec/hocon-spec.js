var hoconParser = require('../lib/hocon');
var expect = require('expect.js');

describe('HOCON test suite', function() {
  describe('JSON subset features', function() {
    it('should be parsed using null value', function() {
      var jsonSubset = '{ "foo" : null }';
      var config = hoconParser.parse(jsonSubset);

      expect(config).to.eql({ foo : null });
    });

    it('should be parsed using empty string value', function() {
      var jsonSubset = '{ "foo" : "" }';
      var config = hoconParser.parse(jsonSubset);

      expect(config).to.eql({ foo : "" });
    });

    it('should be parsed using non-empty string value', function() {
      var jsonSubset = '{ "foo" : "bar" }';
      var config = hoconParser.parse(jsonSubset);

      expect(config).to.eql({ foo : "bar" });
    });

    it('should be parsed using positive number value', function() {
      var jsonSubset = '{ "foo" : 12 }';
      var config = hoconParser.parse(jsonSubset);

      expect(config).to.eql({ foo : 12 });
    });

    it('should be parsed using negative number value', function() {
      var jsonSubset = '{ "foo" : -12 }';
      var config = hoconParser.parse(jsonSubset);

      expect(config).to.eql({ foo : -12 });
    });

    it('should be parsed using true boolean value', function() {
      var jsonSubset = '{ "foo" : true }';
      var config = hoconParser.parse(jsonSubset);

      expect(config).to.eql({ foo : true });
    });

    it('should be parsed using false boolean value', function() {
      var jsonSubset = '{ "foo" : false }';
      var config = hoconParser.parse(jsonSubset);

      expect(config).to.eql({ foo : false });
    });

    it('should be parsed using empty object value', function() {
      var jsonSubset = '{ "foo" : {  } }';
      var config = hoconParser.parse(jsonSubset);

      expect(config).to.eql({ foo : { } });
    });

    it('should be parsed using filled object value', function() {
      var jsonSubset = '{ "foo" : { "bar" : "baz" } }';
      var config = hoconParser.parse(jsonSubset);

      expect(config).to.eql({ foo : { bar : "baz" } });
    });

    it('should be parsed using array of strings', function() {
      var jsonSubset = '{ "foo" : [ "bar" , "baz" ] }';
      var config = hoconParser.parse(jsonSubset);

      expect(config).to.eql({ foo : [ "bar" , "baz" ] });
    });
  });

  describe('HOCON specific features', function(){
    it('should be parsed using = instead of : as pair separator', function() {
      var hoconString = '{ "a" = "b" }';
      var config = hoconParser.parse(hoconString);

      expect(config).to.eql({ a : "b"});
    });

    it('should be parsed without separator if a key is followed by {', function() {
      var hoconString = '{ "a" { } }';
      var config = hoconParser.parse(hoconString);

      expect(config).to.eql({ a : { } });
    });

    it('should be parsed when comments (with forward slashes) are present', function() {
      var hoconString = '//stupid comment\n"a" { }';
      var config = hoconParser.parse(hoconString);

      expect(config).to.eql({ a : { } });
    });

    it('should be parsed when forward slashes are present in quoted strings', function() {
      var hoconString = '{ "a" = "//stupid string" }';
      var config = hoconParser.parse(hoconString);

      expect(config).to.eql({ a : "//stupid string" });
    });

    it('should be parsed when comments (with number sign) are present', function() {
      var hoconString = '#stupid comment\n"a" { }';
      var config = hoconParser.parse(hoconString);

      expect(config).to.eql({ a : { } });
    });

    it('should be parsed when number sign are present in quoted strings', function() {
      var hoconString = '{ "a" = "#stupid string" }';
      var config = hoconParser.parse(hoconString);

      expect(config).to.eql({ a : "#stupid string" });
    });

    it('should be parsed when root braces are omitted', function() {
      var hoconString = '"a" { }';
      var config = hoconParser.parse(hoconString);

      expect(config).to.eql({ a : { } });
    });

    it('shouldn\'t be parsed when unbalanced braces are present', function() {
      var hoconString = '"a" }';

      expect(function(){
        hoconParser.parse(hoconString);
      }).to.throwException(/Parse error/);
    });

    it('should be parsed when exists trailing comma in arrays', function() {
      var hoconString = '{ "foo" : [ "bar" , "baz" , ] }';
      var config = hoconParser.parse(hoconString);

      expect(config).to.eql({ foo : [ "bar" , "baz" ] });
    });

    it('should be parsed when exists break lines instead of commas in arrays', function() {
      var hoconString = '{ "foo" : [ "bar" \n "baz" ] }';
      var config = hoconParser.parse(hoconString);

      expect(config).to.eql({ foo : [ "bar" , "baz" ] });
    });

    it('shouldn\'t be parsed when exists two trailing commas in arrays', function() {
      var hoconString = '{ "foo" : [ "bar" , "baz" , , ] }';

      expect(function() {
        hoconParser.parse(hoconString);
      }).to.throwException(/Parse error/);
    });

    it('shouldn\'t be parsed when exists two commas in a row', function() {
      var hoconString = '{ "foo" : [ "bar" , , "baz" ] }';

      expect(function(){
        hoconParser.parse(hoconString);
      }).to.throwException(/Parse error/);
    });

    it('shouldn\'t be parsed when exists initial comma in arrays', function() {
      var hoconString = '{ "foo" : [ , "bar" , "baz" ] }';

      expect(function(){
        hoconParser.parse(hoconString);
      }).to.throwException(/Parse error/);
    });

    it('should be parsed when exists trailing comma in objects', function() {
      var hoconString = '{ "foo" : { "bar" : "baz" , } }';
      var config = hoconParser.parse(hoconString);

      expect(config).to.eql({ foo : { bar : "baz" } });
    });

    it('shouldn\'t be parsed when exists two trailing commas in objects', function() {
      var hoconString = '{ "foo" : { "bar" : "baz" , , } }';

      expect(function(){
        hoconParser.parse(hoconString);
      }).to.throwException(/Parse error/);
    });

    it('shouldn\'t be parsed when exists two trailing commas in objects', function() {
      var hoconString = '{ "foo" : { "bar" : "baz" , , "qux" : "quuz" } }';

      expect(function(){
        hoconParser.parse(hoconString);
      }).to.throwException(/Parse error/);
    });

    it('shouldn\'t be parsed when exists initial comma in objects', function() {
      var hoconString = '{ "foo" : { , "bar" : "baz" } }';

      expect(function(){
        hoconParser.parse(hoconString);
      }).to.throwException(/Parse error/);
    });

    describe('duplicate keys and object merging', function(){
      it('should be parsed when exists duplicate keys', function() {
        var hoconString = '{ "foo" : { "a" : "42" }, "foo" : { "b" : "43" } }';
        var config = hoconParser.parse(hoconString);

        expect(config).to.eql({ foo : { a : "42" }, foo : { b : "43" } });
      });
    });

    describe('multiline strings', function(){
      it('should be parsed when exists multiline string with single line', function() {
        var hoconString = '{ "foo" : \'\'\'a\'\'\' }';
        var config = hoconParser.parse(hoconString);

        expect(config).to.eql({ foo : "a" });
      });

      it('should be parsed when exists multiline string with multiple lines', function() {
        var hoconString = '{ "foo" : \'\'\'a \n a\'\'\' }';
        var config = hoconParser.parse(hoconString);

        expect(config).to.eql({ foo : "a \n a" });
      });

      it('should be parsed when exists multiline string with single quote ending character', function() {
        var hoconString = '{ "foo" : \'\'\'a\'\'\'\' }';
        var config = hoconParser.parse(hoconString);

        expect(config).to.eql({ foo : "a'" });
      });
    });

  });
});
