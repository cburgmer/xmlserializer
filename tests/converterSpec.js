var html2xhtml = require('../lib/converter').html2xhtml;

describe('html2xhtml', function () {
    var withXHTMLBoilerplate = function (content) {
        return '<html xmlns="http://www.w3.org/1999/xhtml"><head/><body>' +
            content +
            '</body></html>';
    }
    var emptyDocument = function () {
        return '<html xmlns="http://www.w3.org/1999/xhtml"><head/><body/></html>';
    }


    it('should return a valid XHTML document for empty input', function() {
        expect(html2xhtml('')).toEqual(emptyDocument());
    });

    it('should return a valid XHTML document for HTML', function () {
        var xhtml = html2xhtml('<html></html>');

        expect(xhtml).toEqual(emptyDocument());
    });

    it('should serialize comments', function () {
        var xhtml = html2xhtml('<!-- this is a comment -->');

        expect(xhtml).toEqual('<!-- this is a comment -->' + emptyDocument());
    });

    it('should serialize attributes', function () {
        var xhtml = html2xhtml('<p class="myClass"> </p>');

        expect(xhtml).toEqual(withXHTMLBoilerplate('<p class="myClass"> </p>'));
    });

    it('should serialize text', function () {
        var xhtml = html2xhtml('<p> this is text</p>');

        expect(xhtml).toEqual(withXHTMLBoilerplate('<p> this is text</p>'));
    });

    it('should serialize to lower case tag names', function () {
        var xhtml = html2xhtml('<P> </P>');

        expect(xhtml).toEqual(withXHTMLBoilerplate('<p> </p>'));
    });

    it('should serialize to lower case attribute names', function () {
        var xhtml = html2xhtml('<p Class="myClass"> </p>');

        expect(xhtml).toEqual(withXHTMLBoilerplate('<p class="myClass"> </p>'));
    });

    it('should serialize to self closing attribute', function () {
        var xhtml = html2xhtml('<br/>');

        expect(xhtml).toEqual(withXHTMLBoilerplate('<br/>'));
    });
});
