var Parser = require('parse5').Parser;

var cdataBlockTags = ['script', 'style'];

var nodeTreeToXHTML = function (node) {
    var output;

    if (node.nodeName === '#document'
        || node.nodeName === '#document-fragment') {
        return node.childNodes.map(nodeTreeToXHTML).join('');
    } else {
        if (node.tagName) {
            output = '<' + node.tagName;
            if (node.tagName === 'html') {
                 output += ' xmlns="' + node.namespaceURI + '"';
            }

            node.attrs.forEach(function (attr) {
                output += " " + attr.name + '="' + attr.value + '"';
            });


            if (node.childNodes.length > 0) {
                output += '>';

                if (cdataBlockTags.indexOf(node.tagName) >= 0) {
                    output += '<![CDATA[\n';
                }

                output += node.childNodes.map(nodeTreeToXHTML).join('');

                if (cdataBlockTags.indexOf(node.tagName) >= 0) {
                    output += '\n]]>';
                }

                output += '</' + node.tagName + '>';
            } else {
                output += '/>';
            }
            return output;
        } else if (node.nodeName === '#text') {
            return node.value;
        } else if (node.nodeName === '#comment') {
            return '<!--' + node.data + '-->';
        }
    }
};

var parseHTML5 = function (content) {
    var parser = new Parser();
    return parser.parse(content);
}

exports.html2xhtml = function (content) {
    var nodeTree = parseHTML5(content);

    return nodeTreeToXHTML(nodeTree);
};
