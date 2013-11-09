var fs = require('fs'),
    jasmine = require('jasmine-node'),
    browserify = require('browserify');

desc('Runs the tests.');
task('test', {async: true}, function () {
    jasmine.executeSpecsInFolder({
        specFolders: ['tests'],
        onComplete: complete
    });
});

desc('Builds the browser bundle.');
task('browser', function () {
    var b = browserify(),
        w = fs.createWriteStream('dist/html2xhtml.js');
    b.add('./lib/web.js');
    b.bundle().pipe(w);
});

task('default', ['test', 'browser']);
