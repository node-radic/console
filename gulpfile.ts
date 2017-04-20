import * as gulp from "gulp";
import * as fs from 'fs';
import * as ghPages from 'gulp-gh-pages'
import  typedoc from './build/gulp/typedoc'
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

let c = {
    src          : [ 'src/**/*.ts' ],
    fileName     : 'console',
    moduleName   : '@radic/console',
    umdModuleName: 'radic.console'
}

gulp.task('clean', [ 'clean:src', 'clean:build' ])
gulp.task('clean:build', () => gulp.src([ 'dist', 'dts', 'es', 'lib', 'umd', 'coverage', '.publish', 'docs' ]).pipe(clean()))
gulp.task('clean:src', () => gulp.src([ '{src,spec}/*.{js,js.map}', '*.{js,js.map}' ]).pipe(clean()))

//******************************************************************************
//* LINT
//******************************************************************************
// gulp.task("lint", function() {
//
//     var config =  { formatter: "verbose", emitError: (process.env.CI) ? true : false };
// return gulp.run
//     return gulp.src([
//         "src/**/**.ts",
//         "test/**/**.test.ts"
//     ])
//         .pipe(tslint(config))
//         .pipe(tslint.report());
// });

//******************************************************************************
//* BUILD
//******************************************************************************
var tsLibProject = tsc.createProject("tsconfig.json", { module: "es2015", declaration: true, typescript: require("typescript") });

gulp.task("build-lib", function () {
    return gulp.src([
        "src/**/*.ts",
        "!src/**/*.spec.ts"
    ])
        .pipe(tsLibProject())
        .on("error", function (err) {
            process.exit(1);
        })
        .pipe(gulp.dest("lib/"))
});

// var tsEsProject = tsc.createProject("tsconfig.json", { module: "es2015", typescript: require("typescript") });
//
// gulp.task("build-es", function () {
//     return gulp.src([
//         "src/**/*.ts"
//     ])
//         .pipe(tsEsProject())
//         .on("error", function (err) {
//             process.exit(1);
//         })
//         .js.pipe(gulp.dest("es/"));
// });
//
// var tsDtsProject = tsc.createProject("tsconfig.json", {
//     declaration: true,
//     noResolve  : false,
//     typescript : require("typescript")
// });
//
// gulp.task("build-dts", function () {
//     return gulp.src([
//         "src/**/*.ts"
//     ])
//         .pipe(tsDtsProject())
//         .on("error", function (err) {
//             process.exit(1);
//         })
//         .dts.pipe(gulp.dest("dts"));
//
// });
//
// gulp.task('build-dts:concat', [ 'build-dts' ], (done: any) => {
//     let dtsPath = path.join(process.cwd(), 'dts')
//     let dest    = path.join(process.cwd(), 'radic.util.d.ts')
//     fs.existsSync(dest) && fs.unlinkSync(dest);
//
//     let result          = require('dts-bundle').bundle({
//         name                : c.moduleName,
//         main                : 'dts/index.d.ts',
//         outputAsModuleFolder: true,
//         out                 : dest
//     })
//     let content: string = fs.readFileSync(dest, 'utf-8');
//     fs.unlinkSync(dest);
//     fs.writeFile(dest, `
// declare module "@radic/util" {
//     ${content.replace(/declare/g, '')}
// }
// `, done)
//
//
// })


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
})

//******************************************************************************
//* TESTS NODE
//******************************************************************************
var tstProject = tsc.createProject("tsconfig.json", { typescript: require("typescript") });

gulp.task("build-src", function () {
    return gulp.src([
        "src/**/*.ts"
    ])
        .pipe(tstProject())
        .on("error", function (err) {
            process.exit(1);
        })
        .js.pipe(gulp.dest("src/"));
});

var tsTestProject = tsc.createProject("tsconfig.json", { typescript: require("typescript") });

gulp.task("build-test", function () {
    return gulp.src([
        "spec/**/*.ts"
    ])
        .pipe(tsTestProject())
        .on("error", function (err) {
            process.exit(1);
        })
        .js.pipe(gulp.dest("spec/"));
});


gulp.task("jasmine", function () {
    let jasmineJson = require('./jasmine.json')
    return gulp.src(jasmineJson.spec_files)
        .pipe(jasmine({
            reporter: new SpecReporter(),
            config  : jasmineJson
        }))
});
//
// gulp.task("istanbul:hook", function () {
//     return gulp.src(["src/**/*.js"])
//         .pipe(istanbul())
//         .pipe(sourcemaps.write("."))
//         .pipe(istanbul.hookRequire());
// });

// Run browser testings on AppVeyor not in Travis CI

gulp.task("test", function (cb) {
    runSequence("jasmine", cb);
});


//******************************************************************************
//* DEFAULT
//******************************************************************************
gulp.task("build", (cb) => {
    runSequence(
        "clean",
        [ "build-src", "build-lib"],   // tests + build es and lib
        "build-test", cb);
    // , "build-umd", "build-umd:minify"
});

gulp.task("default", (cb) => {
    runSequence(
        "build",
        "test",
        cb);
});

gulp.task('deploy', (cb) => {
    return gulp.src('./docs/**/*')
        .pipe(ghPages());
})