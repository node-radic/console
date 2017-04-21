import * as gulp from "gulp";
import * as fs from 'fs';
import * as ghPages from 'gulp-gh-pages'
import { inspect } from "@radic/util";
//import * as gulp from 'gulp'

/**
 * @type {gulp}
 */
var //gulp        = require("gulp"),
    pump         = require('pump'),
    source       = require("vinyl-source-stream"),
    buffer       = require("vinyl-buffer"),
    tsc          = require("gulp-typescript"),
    sourcemaps   = require("gulp-sourcemaps"),
    uglify       = require("gulp-uglify"),
    rollup       = require('gulp-rollup'),
    rename       = require("gulp-rename"),
    runSequence  = require("run-sequence"),
    istanbul     = require("gulp-istanbul"),
    jasmine      = require("gulp-jasmine"),
    clean        = require('gulp-clean'),
    SpecReporter = require('jasmine-spec-reporter'),
    _            = require('lodash')
;

const c = {
    src          : [ 'src/**/*.ts' ],
    fileName     : 'console',
    moduleName   : '@radic/console',
    umdModuleName: 'radic.console'
};

const tsProject = {
    lib : tsc.createProject("tsconfig.json", { module: "es2015", declaration: true, typescript: require("typescript") }),
    src : tsc.createProject("tsconfig.json", { typescript: require("typescript") }),
    test: tsc.createProject("tsconfig.json", { typescript: require("typescript") })
};

gulp.task('clean', [ 'clean:src', 'clean:build' ]);
gulp.task('clean:build', () => gulp.src([ 'dist', 'dts', 'es', 'lib', 'umd', 'coverage', '.publish', 'docs' ]).pipe(clean()));
gulp.task('clean:src', () => gulp.src([ '{src,spec}/*.{js,js.map}', '*.{js,js.map}' ]).pipe(clean()));

gulp.task("build-lib", function () {
    return gulp.src([
        "src/**/*.ts",
        "!src/**/*.spec.ts"
    ])
        .pipe(tsProject.lib())
        .on("error", function (err) {
            process.exit(1);
        })
        .pipe(gulp.dest("lib/"))
});

gulp.task('build-umd', [ 'build-lib' ], (cb) => {
    pump([

        gulp.src('lib/**/*.js'),
        rollup({
            entry     : './lib/index.js',
            format    : 'umd',
            moduleName: 'radic.console',
            globals   : { lodash: '_' }
        }),
        gulp.dest('./'),
        clean(),
        rename('radic.console.js'),
        gulp.dest('./')
    ], cb)
});

gulp.task('build-umd:minify', [ 'build-umd' ], (cb) => {
    pump([
        gulp.src('./radic.console.js'),
        uglify(),
        rename('radic.console.min.js'),
        gulp.dest('./')
    ], cb)
});

gulp.task("build-src", function () {
    return gulp.src([
        "src/**/*.ts"
    ])
        .pipe(tsProject.src())
        .on("error", function (err) {
            process.exit(1);
        })
        .js.pipe(gulp.dest("src/"));
});

gulp.task("build-test", function () {
    return gulp.src([
        "spec/**/*.ts"
    ])
        .pipe(tsProject.test())
        .on("error", function (err) {
            process.exit(1);
        })
        .js.pipe(gulp.dest("spec/"));
});

gulp.task("jasmine", function () {
    let jasmineJson = require('./jasmine.json');
    return gulp.src(jasmineJson.spec_files)
        .pipe(jasmine({
            reporter: new SpecReporter(),
            config  : jasmineJson
        }))
});

gulp.task("test", function (cb) {
    runSequence("jasmine", cb);
});

gulp.task("build", (cb) => {
    runSequence(
        "clean",
        [ "build-src", "build-lib" ],   // tests + build es and lib
        "build-test", cb);
    // , "build-umd", "build-umd:minify"
});

gulp.task("default", (cb) => {
    runSequence(
        "build",
        "test",
        cb);
});

gulp.task('ghpages', (cb) => {
    return gulp.src('./docs/**/*')
        .pipe(ghPages());
});