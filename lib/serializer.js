var removeInvalidCharacters = function (content) {
    // See http://www.w3.org/TR/xml/#NT-Char for valid XML 1.0 characters
    return content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
};

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

var getTagName = function (node) {
    var tagName = node.tagName;

    // Aid in serializing of original HTML documents
    if (node.namespaceURI === 'http://www.w3.org/1999/xhtml') {
        tagName = tagName.toLowerCase();
    }
    return tagName;
};

var serializeNamespace = function (node) {
    var nodeHasXmlnsAttr = Array.prototype.map.call(node.attributes || node.attrs, function (attr) {
            return attr.name;
        })
        .indexOf('xmlns') >= 0;
    // Serialize the namespace as an xmlns attribute whenever the element
    // doesn't already have one and the inherited namespace does not match
    // the element's namespace.
    // As a special case, always include an xmlns for html elements, in case
    // of broken namespaceURI handling by browsers.
    if (!nodeHasXmlnsAttr &&
            (!node.parentNode ||
             node.namespaceURI !== node.parentNode.namespaceURI ||
             getTagName(node) === 'html')) {
         return ' xmlns="' + node.namespaceURI + '"';
    } else {
        return '';
    }
};

var serializeChildren = function (node) {
    return Array.prototype.map.call(node.childNodes, function (childNode) {
        return nodeTreeToXHTML(childNode);
    }).join('');
};

var serializeTag = function (node) {
    var output = '<' + getTagName(node);
    output += serializeNamespace(node);

    Array.prototype.forEach.call(node.attributes || node.attrs, function (attr) {
        output += serializeAttribute(attr);
    });

    if (node.childNodes.length > 0) {
        output += '>';
        output += serializeChildren(node);
        output += '</' + getTagName(node) + '>';
    } else {
        output += '/>';
    }
    return output;
};

var serializeText = function (node) {
    var text = node.nodeValue || node.value || '';
    return serializeTextContent(text);
};

var serializeComment = function (node) {
    return '<!--' +
        node.data
            .replace(/-/g, '&#45;') +
        '-->';
};

var nodeTreeToXHTML = function (node) {
    if (node.nodeName === '#document' ||
        node.nodeName === '#document-fragment') {
        return serializeChildren(node);
    } else {
        if (node.tagName) {
            return serializeTag(node);
        } else if (node.nodeName === '#text') {
            return serializeText(node);
        } else if (node.nodeName === '#comment') {
            return serializeComment(node);
        }
    }
};

exports.serializeToString = function (document) {
    return removeInvalidCharacters(nodeTreeToXHTML(document));
};
