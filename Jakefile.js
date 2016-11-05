var fs = require('fs');

desc('Checks the syntax');
task('jshint', {async: true}, function () {
    jake.exec('jshint lib/*.js tests/specs/*.js tests/browserSpecs/*.js', {printStdout: true}, function () {
        complete();
    });
});

desc('Runs the tests against node.');
task('testNode', {async: true}, function () {
    console.log("Testing Node.js integration");
    jake.exec('jasmine-node --captureExceptions tests/specs/', {printStdout: true}, function () {
        complete();
    });
});

desc('Runs the tests against a browser (PhantomJS).');
task('testBrowser', {async: true}, function () {
    console.log("Testing browser integration");
    jake.exec('phantomjs tests/run-jasmine.js tests/SpecRunner.html', {printStdout: true}, function () {
        complete();
    });
});

task('test', ['jshint', 'testNode', 'testBrowser']);

task('default', ['test']);
