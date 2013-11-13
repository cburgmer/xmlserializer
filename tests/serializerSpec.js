var getParser = function () {
        if (typeof require !== "undefined") {
            var Parser = require('parse5').Parser;
            return new Parser();
        } else {
            return window.parser;
        }
    },
    getSerializer = function () {
        if (typeof require !== "undefined") {
            return require('../lib/serializer');
        } else {
            return window.xmlserializer;
        }
    },
    parser = getParser(),
    serializer = getSerializer(),
    html2xhtml = function (html) {
        return serializer.serializeToString(parser.parse(html));
    };

describe('xmlserializer.js', function () {
    var withXHTMLBoilerplate = function (body, head) {
        var document = '<html xmlns="http://www.w3.org/1999/xhtml">';
        if (head) {
            document += '<head>' + head + '</head>';
        } else {
            document += '<head/>';
        }
        if (body) {
            document += '<body>' + body + '</body>';
        } else {
            document += '<body/>';
        }
        document += '</html>';
        return document;
    }

    var emptyDocument = function () {
        return withXHTMLBoilerplate();
    }

    it('should return a valid XHTML document for empty input', function() {
        var doc = parser.parse('');

        expect(serializer.serializeToString(doc)).toEqual(emptyDocument());
    });

    it('should return a valid XHTML document for HTML', function () {
        var doc = parser.parse('<html></html>');

        expect(serializer.serializeToString(doc)).toEqual(emptyDocument());
    });

    it('should serialize comments', function () {
        var doc = parser.parse('<html><body><!-- this is a comment -->');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<!-- this is a comment -->'));
    });

    it('should correctly serialize special characters in comments', function () {
        var doc = parser.parse('<html><body><!-- &gt; -->');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<!-- &gt; -->'));
    });

    it('should quote dashes in comments', function () {
        var doc = parser.parse('<html><body><!--- -- - - ---- --->');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<!--&#45; &#45;&#45; &#45; &#45; &#45;&#45;&#45;&#45; &#45;-->'));
    });

    it('should serialize attributes', function () {
        var doc = parser.parse('<p class="myClass"> </p>');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<p class="myClass"> </p>'));
    });

    it('should serialize text', function () {
        var doc = parser.parse('<p> this is text</p>');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<p> this is text</p>'));
    });

    it('should serialize to lower case tag names', function () {
        var doc = parser.parse('<P> </P>');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<p> </p>'));
    });

    it('should serialize to lower case attribute names', function () {
        var doc = parser.parse('<p Class="myClass"> </p>');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<p class="myClass"> </p>'));
    });

    it('should serialize HTML enties', function () {
        var doc = parser.parse('&ndash;');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('–'));
    });

    it('should correctly quote ampersand', function () {
        var doc = parser.parse('&amp;&amp;');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('&amp;&amp;'));
    });

    it('should correctly quote lighter than', function () {
        var doc = parser.parse('&lt;&lt;');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('&lt;&lt;'));
    });

    it('should correctly quote greater than', function () {
        var doc = parser.parse('&gt;&gt;');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('&gt;&gt;'));
    });

    it('should correctly serialize special characters in attributes', function () {
        var doc = parser.parse('<input value="&quot;&gt;&lt;&amp;&apos;"/>');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<input value="&quot;&gt;&lt;&amp;&apos;"/>'));
    });

    it('should serialize to self closing attribute', function () {
        var doc = parser.parse('<br/>');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<br/>'));
    });

    it('should put script content into CDATA blocks', function () {
        var doc = parser.parse('<script>var a = 1 & 1;</script>');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('',
            '<script><![CDATA[\nvar a = 1 & 1;\n]]></script>'));
    });

    it('should put script content into CDATA blocks', function () {
        var doc = parser.parse('<style>span:before { content: "<"; }</style>');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('',
            '<style><![CDATA[\nspan:before { content: "<"; }\n]]></style>'));
    });

    it('should convert boolean attributes', function () {
        var doc = parser.parse('<input type="checkbox" checked/>');

        expect(serializer.serializeToString(doc)).toEqual(withXHTMLBoilerplate('<input type="checkbox" checked=""/>'));
    });

    it('should prefer existing xmlns', function () {
        var doc = parser.parse('<html xmlns="somenamespace"></html>');

        expect(serializer.serializeToString(doc)).toEqual('<html xmlns="somenamespace"><head/><body/></html>');
    });
});
