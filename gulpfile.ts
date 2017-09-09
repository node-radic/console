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
import { config } from 'dotenv'
import { Client, ClientGenerateOptionsFieldType } from 'mockaroo'
import { resolve } from "path";
import { existsSync, removeSync } from "fs-extra";
import { writeFileSync } from "fs";
import { kindOf } from "@radic/util";
import { execSync } from "child_process";

config()
console.dir(process.env)
const mockaroo = new Client({
    apiKey: process.env.MOCKAROO_API_KEY
})
const rollup   = require('gulp-rollup'),
      clean    = require('gulp-clean');

const c = {
    src          : [
        'src/**/*.ts',
        'src/**/*.d.ts',
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

gulp.task('clean', [ 'clean:src:js', 'clean:build', 'clean:docs' ], () => pump(gulp.src([ '.nyc_output', 'coverage' ]), clean()))
gulp.task('clean:docs', () => pump(gulp.src([ 'docs', '.publish' ]), clean()))
gulp.task('clean:build', () => pump(gulp.src([ 'lib', 'es', 'dts', 'coverage', '.publish', 'docs' ]), clean()));
gulp.task('clean:watch', () => pump(gulp.src([ 'lib', 'dts' ]), clean()));
gulp.task('clean:src:js', () => pump(gulp.src([ '{src,examples}/*/**.{js,js.map}', '*.{js,js.map}' ]), clean()));
gulp.task('clean:test:js', () => pump(gulp.src([ '{tests}/*.{js,js.map}', '*.{js,js.map}' ]), clean()));
gulp.task('clean:dts:js', () => pump(gulp.src([ 'dts/**/*.js' ]), clean()))

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

gulp.task('mockaroo:generate', async () => {
    let filePath = resolve(__dirname, 'examples/data.json')
    execSync(`curl "http://api.mockaroo.com/api/e4dc0940?count=20&key=c5700090" > "${filePath}"`)
    return Promise.resolve();
})