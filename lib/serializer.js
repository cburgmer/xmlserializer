var cdataBlockTags = ['script', 'style'];

var serializeAttributeValue = function (value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

var serializeTextContent = function (content) {
    return content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};

var serializeAttribute = function (attr) {
    var value = attr.value;

    return ' ' + attr.name + '="' + serializeAttributeValue(value) + '"';
};

var serializeNamespace = function (node) {
    var nodeHasXmlnsAttr = Array.prototype.map.call(node.attributes || node.attrs, function (attr) {
            return attr.name;
        })
        .indexOf('xmlns') >= 0;
    if (node.tagName.toLowerCase() === 'html' && !nodeHasXmlnsAttr) {
         return ' xmlns="' + node.namespaceURI + '"';
    } else {
        return '';
    }
};

var serializeChildren = function (node, wrappedInCDATA) {
    return Array.prototype.map.call(node.childNodes, function (childNode) {
        return nodeTreeToXHTML(childNode, wrappedInCDATA);
    }).join('');
};

var serializeTag = function (node) {
    var output = '<' + node.tagName.toLowerCase();
    output += serializeNamespace(node);

    Array.prototype.forEach.call(node.attributes || node.attrs, function (attr) {
        output += serializeAttribute(attr);
    });

    if (node.childNodes.length > 0) {
        output += '>';

        if (cdataBlockTags.indexOf(node.tagName.toLowerCase()) >= 0) {
            output += '<![CDATA[\n';
            output += serializeChildren(node, true);
            output += '\n]' + ']>'; // "quote" closing tag as not to mess up HTML parser when embedded
        } else {
            output += serializeChildren(node);
        }

        output += '</' + node.tagName.toLowerCase() + '>';
    } else {
        output += '/>';
    }
    return output;
};

var serializeText = function (node, wrappedInCDATA) {
    var text = node.nodeValue || node.value || '';
    if (!wrappedInCDATA) {
        text = serializeTextContent(text);
    }
    return text;
};

var serializeComment = function (node) {
    return '<!--' +
        node.data
            .replace(/-/g, '&#45;') +
        '-->';
};

var nodeTreeToXHTML = function (node, wrappedInCDATA) {
    if (node.nodeName === '#document' ||
        node.nodeName === '#document-fragment') {
        return serializeChildren(node);
    } else {
        if (node.tagName) {
            return serializeTag(node);
        } else if (node.nodeName === '#text') {
            return serializeText(node, wrappedInCDATA);
        } else if (node.nodeName === '#comment') {
            return serializeComment(node);
        }
    }
};

exports.serializeToString = function (document) {
    return nodeTreeToXHTML(document);
};
