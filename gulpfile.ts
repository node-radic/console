import * as gulp from "gulp";
import { WatchOptions } from "gulp";
import * as ts from 'typescript';
import * as tsc from 'gulp-typescript';
import * as pump from 'pump';
import * as sequence from 'run-sequence';
import * as sourcemaps from 'gulp-sourcemaps';
import * as uglify from 'gulp-uglify';
import * as rename from 'gulp-rename';
import * as buffer from "vinyl-buffer";
import * as source from "vinyl-source-stream";
import * as ghPages from "gulp-gh-pages";

const rollup = require('gulp-rollup'),
      clean  = require('gulp-clean');

const c = {
    src          : [
        'src/**/*.ts',
        "!src/**/*.spec.ts",
        "types/**/*.d.ts"
    ],
    fileName     : 'radical-console',
    moduleName   : 'radical-console',
    umdModuleName: 'radical-console',
    tsc          : {
        es  : tsc.createProject("tsconfig.json", { module: "es2015", declaration: false, typescript: ts }),
        src : tsc.createProject("tsconfig.json", { typescript: ts, sourceMap: true }),
        lib : tsc.createProject("tsconfig.json", { typescript: ts, declaration: false, target: 'es5' }),
        dts : tsc.createProject("tsconfig.json", { typescript: ts, declaration: true, target: 'es5' }),
        test: tsc.createProject("tsconfig.json", { target: "es6", sourceMap: true, typescript: ts })
    }
};

gulp.task('clean', [ 'clean:src:js', 'clean:build', 'clean:docs' ], (cb) => pump(gulp.src([ '.nyc_output', 'coverage' ]), clean()))
gulp.task('clean:docs', (cb) => pump(gulp.src([ 'docs', '.publish' ]), clean()))
gulp.task('clean:build', (cb) => pump(gulp.src([ 'lib', 'es', 'dts', 'coverage', '.publish', 'docs' ]), clean()));
gulp.task('clean:watch', (cb) => pump(gulp.src([ 'lib', 'dts' ]), clean()));
gulp.task('clean:src:js', (cb) => pump(gulp.src([ '{src,examples}/*.{js,js.map}', '*.{js,js.map}' ]), clean()));
gulp.task('clean:test:js', (cb) => pump(gulp.src([ '{tests}/*.{js,js.map}', '*.{js,js.map}' ]), clean()));
gulp.task('clean:dts:js', (cb) => pump(gulp.src([ 'dts/**/*.js' ]), clean()))

gulp.task("build:es", () => pump(gulp.src(c.src), c.tsc.es(), gulp.dest("es/")))
gulp.task("build:dts:ts", () => pump(gulp.src(c.src), c.tsc.dts(), gulp.dest('dts/')))
gulp.task('build:lib', () => pump(gulp.src(c.src), c.tsc.lib(), gulp.dest("lib/")))
gulp.task('build:src', () => pump(gulp.src(c.src), c.tsc.src(), gulp.dest("src/")))
gulp.task("build:test", () => pump(gulp.src([ "tests/**/*.ts" ]), c.tsc.test(), gulp.dest("tests/")))
gulp.task('build:dts', (cb) => sequence('build:dts:ts', 'clean:dts:js', cb))

gulp.task("build", (cb) => sequence(
    "clean",
    [ "build:src", "build:lib", 'build:es', 'build:dts' ],
    "build:test", cb
));

gulp.task("build:watch", (cb) => sequence(
    "clean:watch",
    [ 'build:lib', 'build:es', 'build:dts' ],
    cb
));

gulp.task('watch', () => { gulp.watch(c.src, <WatchOptions>{ debounceDelay: 3000, interval: 3000 }, [ 'build:watch' ])})

gulp.task("default", [ 'build' ]); //(cb) => sequence("build", cb))

gulp.task('ghpages', () => pump([ gulp.src('./docs/**/*'), ghPages({
    remoteUrl: 'github.com:node-radic/console'
}) ]));