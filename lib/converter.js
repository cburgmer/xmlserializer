var Parser = require('parse5').Parser;

var cdataBlockTags = ['script', 'style'];

var serializeAttribute = function (attr) {
    var value = attr.value;

    return ' ' + attr.name + '="' + value + '"';
};

var serializeNamespace = function (node) {
    var nodeHasXmlnsAttr = node.attrs.map(function (attr) {
            return attr.name;
        })
        .indexOf('xmlns') >= 0;
    if (node.tagName === 'html' && !nodeHasXmlnsAttr) {
         return ' xmlns="' + node.namespaceURI + '"';
    } else {
        return '';
    }
};

var serializeChildren = function (node, wrappedInCDATA) {
    return node.childNodes.map(function (childNode) {
        return nodeTreeToXHTML(childNode, wrappedInCDATA)
    }).join('');
};

var serializeTag = function (node) {
    var output = '<' + node.tagName;
    output += serializeNamespace(node);

    node.attrs.forEach(function (attr) {
        output += serializeAttribute(attr);
    });

    if (node.childNodes.length > 0) {
        output += '>';

        if (cdataBlockTags.indexOf(node.tagName) >= 0) {
            output += '<![CDATA[\n';
            output += serializeChildren(node, true);
            output += '\n]' + ']>'; // "quote" closing tag as not to mess up HTML parser when embedded
        } else {
            output += serializeChildren(node);
        }

        output += '</' + node.tagName + '>';
    } else {
        output += '/>';
    }
    return output;
};

var serializeText = function (node, wrappedInCDATA) {
    var text = node.value;
    if (!wrappedInCDATA) {
        text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
    }
    return text;
};

var nodeTreeToXHTML = function (node, wrappedInCDATA) {
    if (node.nodeName === '#document'
        || node.nodeName === '#document-fragment') {
        return serializeChildren(node);
    } else {
        if (node.tagName) {
            return serializeTag(node);
        } else if (node.nodeName === '#text') {
            return serializeText(node, wrappedInCDATA);
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
