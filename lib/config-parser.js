var jison = require('jison');
var fs = require('fs');

var Config = require('./config/config');
var ConfigReadError = require('./errors/config-read-error');

var ConfigParser = (function(){

  var DEFAULT_ENCODING = 'utf8';

  var grammar = {
      "comment": "HOCON Grammar parser",
      "author": "Daniel Ortega",

      "lex": {
          "macros": {
              "digit": "[0-9]",
              "esc": "\\\\",
              "int": "-?(?:[0-9]|[1-9][0-9]+)",
              "exp": "(?:[eE][-+]?[0-9]+)",
              "frac": "(?:\\.[0-9]+)",
              "breakline": "(\\r?\\n)+\\s*",
              "comment_start": "(//|#)"
          },
          "rules": [
              ["[^\\S\\r\\n]+", "/* skip whitespace */"],
              ["{comment_start}.*{breakline}", "/* skip single line comments */"],
              ["{breakline}", "return 'NEW_LINE'"],
              ["{int}{frac}?{exp}?\\b", "return 'NUMBER'"],
              ["\"(?:{esc}[\"bfnrt/{esc}]|{esc}u[a-fA-F0-9]{4}|[^\"{esc}])*\"", "yytext = yytext.substr(1, yyleng-2); return 'QUOTED_STRING';"],
              ["(?!true|false|null)(?:[^\\{\\[\\}\\]\\$,#=:])+", "return 'UNQUOTED_STRING'"],
              ["\\{{breakline}*", "return '{'"],
              ["\\}{breakline}*", "return '}'"],
              ["\\[", "return '['"],
              ["\\]", "return ']'"],
              [",", "return ','"],
              [":|=|\\+=", "return 'SEPARATOR'"],
              ["true\\b", "return 'TRUE'"],
              ["false\\b", "return 'FALSE'"],
              ["null\\b", "return 'NULL'"]
          ]
      },

      "tokens": "QUOTED_STRING UNQUOTED_STRING NUMBER { } [ ] , SEPARATOR TRUE FALSE NULL",
      "start": "Root",

      "bnf": {
          "HOCONRoot": [[  "{ }", "$$ = {};" ],
                      [  "{ HOCONMemberList }", "$$ = $2;" ],
                      [  "HOCONMemberList", "$$ = $1;" ]],

          "Root": [[ "HOCONRoot", "return new yy.Config($1);" ]],

          "HOCONString": [[ "QUOTED_STRING" , "$$ = yytext;" ],
                          ["UNQUOTED_STRING", "$$ = yytext;" ]],

          "HOCONNullLiteral": [[ "NULL", "$$ = null;" ]],

          "HOCONNumber": [[ "NUMBER", "$$ = Number(yytext);" ]],

          "HOCONBooleanLiteral": [[ "TRUE", "$$ = true;" ],
                                  ["FALSE", "$$ = false;" ]],

          "HOCONValue": [[ "HOCONNullLiteral", "$$ = $1;" ],
                         [ "HOCONBooleanLiteral", "$$ = $1;" ],
                         [ "HOCONString", "$$ = $1;" ],
                         [ "HOCONNumber", "$$ = $1;" ],
                         [ "HOCONObject", "$$ = $1;" ],
                         [ "HOCONArray", "$$ = $1;" ]],

          "HOCONObject": [[ "{ }", "$$ = {};" ],
                          [ "{ HOCONMemberList }", "$$ = $2;" ],
                          [ "{ HOCONMemberList , }", "$$ = $2;" ]],

          "HOCONMember": [[ "HOCONString SEPARATOR HOCONValue", "$$ = [$1, $3];" ],
                          [ "HOCONString HOCONObject", "$$ = [$1, $2];" ]],

          "HOCONMemberList": [[ "HOCONMember", "$$ = {}; $$[$1[0]] = $1[1];" ],
                              [ "HOCONMemberList , HOCONMember", "$$ = $1; $1[$3[0]] = $3[1];" ]],

          "HOCONArray": [[ "[ ]", "$$ = [];" ],
                         [ "[ HOCONElementList ]", "$$ = $2;" ],
                         [ "[ HOCONElementList , ]", "$$ = $2;" ]],

          "HOCONElementList": [[ "HOCONValue", "$$ = [$1];" ],
                               [  "HOCONElementList , HOCONValue", "$$ = $1; $1.push($3);" ],
                               [  "HOCONElementList NEW_LINE HOCONValue", "$$ = $1; $1.push($3);" ]]
      }
  };

  var options = {type: "slr", moduleType: "commonjs", moduleName: "hoconparse"};

  var parser = new jison.Parser(grammar);

  parser.yy.Config = function(value) {
    return new Config(value);
  };

  var parseString = function(string){
    return parser.parse(string);
  };

  var parseFile = function(path) {
    try {
      return parseString(fs.readFileSync(path, DEFAULT_ENCODING));
    } catch(err) {
      if (err.code !== 'ENOENT') throw err;
      throw new ConfigReadError('cannot read file \'' + path + '\'. File does not exists or cannot be read');
    }
  };

  return {
      parseString: parseString,
      parseFile: parseFile
  };
})();

module.exports = ConfigParser;
