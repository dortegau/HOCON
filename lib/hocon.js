var Parser = require("jison").Parser;

exports.grammar = {
    "comment": "HOCON Grammar parser",
    "author": "Daniel Ortega",

    "lex": {
        "macros": {
            "digit": "[0-9]",
            "esc": "\\\\",
            "int": "-?(?:[0-9]|[1-9][0-9]+)",
            "exp": "(?:[eE][-+]?[0-9]+)",
            "frac": "(?:\\.[0-9]+)"
        },
        "rules": [
            ["\\s+", "/* skip whitespace */"],
            ["{int}{frac}?{exp}?\\b", "return 'NUMBER';"],
            ["\"(?:{esc}[\"bfnrt/{esc}]|{esc}u[a-fA-F0-9]{4}|[^\"{esc}])*\"", "yytext = yytext.substr(1,yyleng-2); return 'STRING';"],
            ["\\{", "return '{'"],
            ["\\}", "return '}'"],
            ["\\[", "return '['"],
            ["\\]", "return ']'"],
            [",", "return ','"],
            [":|=", "return 'SEPARATOR'"],
            ["=", "return '='"],
            ["true\\b", "return 'TRUE'"],
            ["false\\b", "return 'FALSE'"],
            ["null\\b", "return 'NULL'"]
        ]
    },

    "tokens": "STRING NUMBER { } [ ] , SEPARATOR TRUE FALSE NULL",
    "start": "HOCONRoot",

    "bnf": {
        "HOCONString": [ "STRING" ],

        "HOCONNullLiteral": [ "NULL" ],

        "HOCONNumber": [ "NUMBER" ],

        "HOCONBooleanLiteral": [ "TRUE", "FALSE" ],

        "HOCONSeparator": [ "SEPARATOR" ],

        "HOCONValue": [ "HOCONNullLiteral",
                       "HOCONBooleanLiteral",
                       "HOCONString",
                       "HOCONNumber",
                       "HOCONObject",
                       "HOCONArray" ],

        "HOCONRoot": [  "{ }",
                        "{ HOCONMemberList }",
                        "HOCONMemberList"

        ],
        "HOCONObject": [ "{ }",
                         "{ HOCONMemberList }" ],

        "HOCONMember": [ "HOCONString HOCONSeparator HOCONValue",
                         "HOCONString HOCONObject"],

        "HOCONMemberList": [ "HOCONMember",
                             "HOCONMemberList , HOCONMember" ],

        "HOCONArray": [ "[ ]",
                        "[ HOCONElementList ]" ],

        "HOCONElementList": [ "HOCONValue",
                              "HOCONElementList , HOCONValue" ]
    }
};

var options = {type: "slr", moduleType: "commonjs", moduleName: "jsoncheck"};

module.exports = function(){
  return new Parser(exports.grammar);
}
