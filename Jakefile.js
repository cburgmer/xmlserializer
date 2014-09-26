var fs = require('fs'),
    browserify = require('browserify');

desc('Checks the syntax');
task('jshint', {async: true}, function () {
    jake.exec('jshint lib/*.js tests/specs/*.js tests/browserSpecs/*.js', {printStdout: true}, function () {
        complete();
    });
});

desc('Runs the tests against node.');
task('testNode', {async: true}, function () {
    console.log("Testing Node.js integration");
    jake.exec('jasmine-node tests/specs/', {printStdout: true}, function () {
        complete();
    });
});

desc('Runs the tests against a browser (PhantomJS).');
task('testBrowser', ['browser'], {async: true}, function () {
    console.log("Testing browser integration");
    jake.exec('phantomjs tests/run-jasmine.js tests/SpecRunner.html', {printStdout: true}, function () {
        complete();
    });
});

directory("dist");

desc('Builds the browser bundle.');
task('browser', ['dist'], function () {
    var target = 'dist/xmlserializer.js';
    console.log("Building browser bundle in", target);

    var b = browserify(),
        w = fs.createWriteStream(target);
    b.add('./lib/serializer.js');
    b.bundle({
        standalone: 'xmlserializer'
    }).pipe(w);
});

task('test', ['jshint', 'testNode', 'testBrowser']);

task('default', ['test', 'browser']);
