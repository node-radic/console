import * as gulp from "gulp";
import * as fs from "fs-extra";
import * as tsc from "gulp-typescript";
import { resolve } from "path";
import * as _ from 'lodash'

const c = {
    src          : [ 'src/**/*.ts' ],
    fileName     : 'console',
    moduleName   : '@radic/console',
    umdModuleName: 'radic.console'
};

const binFile = `#!/usr/bin/env node
import cli from '../spec/groups/fixture/index'
let parsedRootNode = cli.parse()
let parsedNode = cli.resolve()

cli.handle(parsedNode);`

const tsProject = {
    lib : tsc.createProject("tsconfig.json", { module: "es2015", declaration: true, typescript: require("typescript") }),
    src : tsc.createProject("tsconfig.json", { typescript: require("typescript") }),
    test: tsc.createProject("tsconfig.json", { typescript: require("typescript") })
};


const
    pump         = require('pump'),
    source       = require("vinyl-source-stream"),
    buffer       = require("vinyl-buffer"),
    sourcemaps   = require("gulp-sourcemaps"),
    uglify       = require("gulp-uglify"),
    rollup       = require('gulp-rollup'),
    rename       = require("gulp-rename"),
    runSequence  = require("run-sequence"),
    istanbul     = require("gulp-istanbul"),
    jasmine      = require("gulp-jasmine"),
    clean        = require('gulp-clean'),
    SpecReporter = require('jasmine-spec-reporter'),
    ghPages      = require("gulp-gh-pages")
;

gulp.task('clean', [ 'clean:src', 'clean:build' ]);

gulp.task('clean:build', () => gulp.src([ 'dist', 'dts', 'es', 'lib', 'umd', 'coverage', '.publish', 'docs' ]).pipe(clean()));

gulp.task('clean:src', () => gulp.src([ '{src,spec}/*.{js,js.map}', '*.{js,js.map}' ]).pipe(clean()));

gulp.task("build:lib", () => {
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

gulp.task('build:umd', [ 'build:lib' ], (cb) => {
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

gulp.task('build:umd:minify', [ 'build:umd' ], (cb) => {
    pump([
        gulp.src('./radic.console.js'),
        uglify(),
        rename('radic.console.min.js'),
        gulp.dest('./')
    ], cb)
});

gulp.task("build:src", () => {
    return gulp.src([
        "src/**/*.ts"
    ])
        .pipe(tsProject.src())
        .on("error", function (err) {
            process.exit(1);
        })
        .js.pipe(gulp.dest("src/"));
});

gulp.task("build:test", () => {
    return gulp.src([
        "spec/**/*.ts"
    ])
        .pipe(tsProject.test())
        .on("error", function (err) {
            process.exit(1);
        })
        .js.pipe(gulp.dest("spec/"));
});

gulp.task("build", (cb) => {
    runSequence(
        "clean",
        [ "build:src", "build:lib" ],   // tests + build es and lib
        "build:test", cb);
    // , "build:umd", "build:umd:minify"
});


gulp.task("test", () => {
    // runSequence("jasmine", cb);

    let jasmineJson = require('./jasmine.json');
    return gulp.src(jasmineJson.spec_files)
        .pipe(jasmine({
            reporter: new SpecReporter({
                displayStacktrace: true,
                displaySpecDuration: true
            }),
            config  : jasmineJson
        }))
});

gulp.task("default", (cb) => {
    runSequence(
        "build",
        cb);
});

gulp.task('ghpages', () => {
    return gulp.src('./docs/**/*')
        .pipe(ghPages());
});

gulp.task('create-bin', (cb) => {
    fs.ensureDirSync(resolve(__dirname, 'bin'));
    fs.writeFile(resolve(__dirname, 'bin', 'rcli.ts'), binFile, { encoding: 'utf-8' }, (err: NodeJS.ErrnoException) => {
        if ( err ) throw err;
        cb();
    })
})

