var gulp = require('gulp');
var gutil = require('gulp-util');
var run = require('gulp-run');
var productName = require('./package.json').productName;
var electronVersion = require('./package.json').electronVersion;

var node_modules_dir = 'node_modules/';
var assets = {
    scripts: "./public/js/**/*",
    css: "./public/css/**/*",
    images: "./public/images/**/*"
};

gulp.task('run', function() {
    return run('./node_modules/.bin/electron .').exec();
});

gulp.task('build', function() {
    return run('./node_modules/.bin/electron-packager . ' + productName + ' --out=dist --ignore="^/dist$" --prune --asar --all --version=' + electronVersion).exec();
});

gulp.task('default', ['run']);
