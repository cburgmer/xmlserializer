window.xmlserializer = require('./serializer');

var Parser = require('parse5').Parser;

window.parseHTML5 = function (content) {
    var parser = new Parser();
    return parser.parse(content);
};
