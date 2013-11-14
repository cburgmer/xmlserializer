var parser = window.parser,
    serializer = window.xmlserializer;

describe('xmlserializer', function () {
    it("should not choke on null text node value", function () {
        var doc = document.implementation.createHTMLDocument("");
        doc.body.innerHTML = "Test content";

        expect(serializer.serializeToString(doc)).toMatch(/<title><\/title>/);
    });
});
