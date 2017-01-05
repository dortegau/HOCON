var jison = require("jison");

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
            "break": "(\\r?\\n)+\\s*"
        },
        "rules": [
            ["[^\\S\\r\\n]+", "/* skip whitespace */"],
            ["(//|#).*{break}", "/* skip comments */"],
            ["{break}", "return 'NEW_LINE'"],
            ["{int}{frac}?{exp}?\\b", "return 'NUMBER';"],
            ["\"(?:{esc}[\"bfnrt/{esc}]|{esc}u[a-fA-F0-9]{4}|[^\"{esc}])*\"", "yytext = yytext.substr(1,yyleng-2); return 'STRING';"],
            ["\\{", "return '{'"],
            ["\\}", "return '}'"],
            ["\\[", "return '['"],
            ["\\]", "return ']'"],
            [",", "return ','"],
            [":|=|\\+=", "return 'SEPARATOR'"],
            ["true\\b", "return 'TRUE'"],
            ["false\\b", "return 'FALSE'"],
            ["null\\b", "return 'NULL'"]
        ]
    },

    "tokens": "STRING NUMBER { } [ ] , SEPARATOR TRUE FALSE NULL",
    "start": "Root",

    "bnf": {
        "HOCONString": [[ "STRING", "$$ = yytext;" ]],

        "HOCONNullLiteral": [[ "NULL", "$$ = null;" ]],

        "HOCONNumber": [[ "NUMBER", "$$ = Number(yytext);" ]],

        "HOCONBooleanLiteral": [[ "TRUE", "$$ = true;" ],
                                ["FALSE", "$$ = false;" ]],

        "Root": [[ "HOCONRoot", "return new yy.Config($1);" ]],

        "HOCONRoot": [[  "{ }", "$$ = {};" ],
                      [  "{ HOCONMemberList }", "$$ = $2;" ],
                      [  "HOCONMemberList", "$$ = $1;" ]],

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

var scope = parser.yy;

scope.Config = function() {
  return this.init.apply(this, arguments);
}

scope.Config.prototype = {
  init: function(value){
    this.config = {};
    this.config.getString = function(){
      return null;
    }

    return value;
  }
}

module.exports = parser;
