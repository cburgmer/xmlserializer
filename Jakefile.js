var fs = require('fs'),
    jasmine = require('jasmine-node'),
    browserify = require('browserify');

desc('Runs the tests against node.');
task('testNode', {async: true}, function () {
    console.log("Testing Node.js integration");
    jasmine.executeSpecsInFolder({
        specFolders: ['tests/specs'],
        onComplete: complete
    });
});

desc('Runs the tests against a browser (PhantomJS).');
task('testBrowser', {async: true}, ['browser'], function () {
    console.log("Testing browser integration");
    jake.exec('phantomjs tests/run-jasmine.js tests/SpecRunner.html', {printStdout: true}, function () {
        complete();
    });
});

desc('Builds the browser bundle.');
task('browser', function () {
    var b = browserify(),
        w = fs.createWriteStream('dist/xmlserializer.js');
    b.add('./lib/serializer.js');
    b.bundle({
        standalone: 'xmlserializer'
    }).pipe(w);
});

task('test', ['testNode', 'testBrowser']);

task('default', ['test', 'browser']);
