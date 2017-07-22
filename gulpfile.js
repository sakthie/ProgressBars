
'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var chmod = require('gulp-chmod');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var notify = require('gulp-notify');
var buffer = require('vinyl-buffer');
var argv = require('yargs').argv;
// sass
//var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var watchify = require('watchify');
var transform = require('vinyl-transform');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var minifyHTML = require('gulp-minify-html');


// gulp build --production
var production = !!argv.production;
// determine if we're doing a build
// and if so, bypass the livereload
var build = argv._.length ? argv._[0] === 'build' : false;
var watch = argv._.length ? argv._[0] === 'watch' : true;

// ----------------------------
// Error notification methods
// ----------------------------
var handleError = function (task) {
    return function (err) {

        notify.onError({
            message: task + ' failed, check the logs..',
            sound: false
        })(err);

        gutil.log(gutil.colors.bgRed(task + ' error:'), gutil.colors.white(err));
    };
};
// --------------------------
//  assign read/write permission
// --------------------------
var chMod = function () {
    return chmod({
        owner: {
            read: true,
            write: true,
            execute: true
        },
        group: {
            execute: true
        },
        others: {
            execute: true
        }
    });
}
// --------------------------
// CUSTOM TASK METHODS
// --------------------------
var tasks = {
    // --------------------------
    // Delete build folder
    // --------------------------
    clean: function (cb) {
        gutil.log(gutil.colors.bgGreen('..... CLEAN started .....'));
        del.sync([
        'build/**/**/*.*'
        ]);

        del.sync([
        'build/**/*.*'
        ]);

        del.sync([
        'build/'
        ]);

        gutil.log(gutil.colors.bgGreen('..... CLEAN completed .....'));
        return true;
    },
    // --------------------------
    // Copy static assets
    // --------------------------
    assets: function () {
        gutil.log(gutil.colors.bgGreen('..... ASSETS (all libraries) started .....'));

        gulp.src('app/lib/**/*')
            .pipe(chMod())
            .pipe(gulp.dest('build/lib/'));

        gutil.log(gutil.colors.bgGreen('..... ASSETS (all libraries) completed .....'));

        return true;
    },
    // ---------------------------
    // HTML
    // --------------------------
    // html templates (when using the connect server)
    templates: function () {
        gutil.log(gutil.colors.bgGreen('..... TEMPLATES html started .....'));
        var opts = {
            conditionals: true,
            spare: true
        };

        gulp.src(['app/views/*.html', 'app/views/**/*.html'])
            .pipe(gulpif(production, minifyHTML(opts)))
            .pipe(chMod())
            .pipe(gulp.dest('build/views/'));

        gulp.src('app/index.html')
            .pipe(gulpif(production, minifyHTML(opts)))
            .pipe(chMod())
            .pipe(gulp.dest('build/'));

        gutil.log(gutil.colors.bgGreen('..... TEMPLATES html completed .....'));

        return true;
    },
    css: function () {
        gutil.log(gutil.colors.bgGreen('..... CSS started .....'));

        gulp.src('app/styles/**/*.css')
            .pipe(chMod())
            .pipe(gulp.dest('build/css'));

        gutil.log(gutil.colors.bgGreen('..... CSS completed .....'));
        return true;

    },
   

    browserify: function () {
        gutil.log(gutil.colors.bgGreen('..... BROWSERIFY started .....'));
        gulp.src(['app/scripts/**/*.js', 'app/scripts/app.js'])
            .pipe(chMod())
            .pipe(gulpif(production, buffer()))
            .pipe(gulpif(production, uglify()))
            .pipe(concat('build.js'))
            .pipe(gulp.dest('build/scripts/'));
        gutil.log(gutil.colors.bgGreen('..... BROWSERIFY completed .....'));
        return true;
    },
    // --------------------------
    // linting
    // --------------------------
    lintjs: function () {
        return gulp.src([
            'gulpfile.js',
            'app/app.js',
            'app/scripts/**/*.js'
        ]).pipe(jshint())
          .pipe(jshint.reporter(stylish))
          .on('error', function () {
              //beep();
              handleError('lintjs')
          });
        return true;
    },

};

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "build"
        },
        port: process.env.PORT || 3000
    });
});

//gulp.task('reload-sass', ['sass'], function () {
//    browserSync.reload();
//});
gulp.task('reload-js', ['browserify'], function () {
    browserSync.reload();
});
gulp.task('reload-templates', ['templates'], function () {
    browserSync.reload();
});
gulp.task('reload-css', ['css'], function () {
    browserSync.reload();
});

// --------------------------
// CUSTOMS TASKS
// --------------------------
gulp.task('clean', tasks.clean);
// for production we require the clean method on every individual task
var req = build ? ['clean'] : [];
// individual tasks
gulp.task('templates', req, tasks.templates);
gulp.task('assets', req, tasks.assets);
//gulp.task('sass', req, tasks.sass);
gulp.task('css', req, tasks.css);
gulp.task('browserify', req, tasks.browserify);
gulp.task('lint:js', tasks.lintjs);
gulp.task('css', tasks.css);

// --------------------------
// DEV/WATCH TASK
// --------------------------
gulp.task('watch', ['browser-sync'],
    function () {
        // --------------------------
        gutil.log(gutil.colors.bgGreen('.....Watch monitoring started.....'));       
        gulp.watch('app/styles/**/*.css', ['reload-css']);       
        gulp.watch('app/index.html', ['reload-templates']);
        gulp.watch('app/views/*.html', ['reload-templates']);
        gulp.watch('app/views/**/*.html', ['reload-templates']);
        gulp.watch('app/lib/**/*', ['reload-assets']);
        gulp.watch('app/scripts/**/*.js', ['lint:js', 'reload-js']);
        gulp.watch('app/scripts/*.js', ['lint:js', 'reload-js']);
        gutil.log(gutil.colors.bgGreen('     Watching for changes.....'));
        // --------------------------
    });

// build tasks  
gulp.task('build', [
          'clean',
          'css',           
          'templates',
          'assets',          
          'browserify'
]);

gulp.task('default', ['watch']);






