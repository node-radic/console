import * as through2 from 'through2';
import * as gutil from 'gulp-util';
import * as path from "path";
import * as File from 'vinyl';
import { inspect } from "@radic/util";

export default (options:any) => through2.obj((file:File, enc, cb) => {
    let filepath = file.path,
        cwd = file.cwd,
        relative = path.relative(cwd, filepath)

    inspect({file, filepath, cwd, relative})

})
//
// module.exports = function (options) {
//     return through2.obj(function (file, enc, cb) {
//
//
//         //
//         // // Prevent mistakes with paths
//         // if (!(relative.substr(0, 2) === '..') && relative !== '' || (options ? (options.force && typeof options.force === 'boolean') : false)) {
//         //     rimraf(filepath, function (error) {
//         //         if (error) {
//         //             this.emit('error', new gutil.PluginError('gulp-clean', 'Unable to delete "' + filepath + '" file (' + error.message + ').'));
//         //         }
//         //         this.push(file);
//         //         cb();
//         //     }.bind(this));
//         // } else if (relative === '') {
//         //     var msgCurrent = 'Cannot delete current working directory. (' + filepath + '). Use option force.';
//         //     gutil.log('gulp-clean: ' + msgCurrent);
//         //     this.emit('error', new gutil.PluginError('gulp-clean', msgCurrent));
//         //     this.push(file);
//         //     cb();
//         // } else {
//         //     var msgOutside = 'Cannot delete files outside the current working directory. (' + filepath + '). Use option force.';
//         //     gutil.log('gulp-clean: ' + msgOutside);
//         //     this.emit('error', new gutil.PluginError('gulp-clean', msgOutside));
//         //     this.push(file);
//         //     cb();
//         // }
//     });
// };
