"use strict";

let gulp = require("gulp"),
    autoprefixer = require("gulp-autoprefixer"),
    exec = require("gulp-exec"),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    cp = require("child_process");

gulp.task("scss", function() {
    // return gulp.src( '_assets/scss/**/*.scss' )
    return gulp.src( '_assets/css/**/*.css' )
        // .pipe( sass().on('error', sass.logError) )
        .pipe( autoprefixer() )
        .pipe( gulp.dest( './docs/css/' ) )
        .pipe( browserSync.stream({ match: '**/*.css' }) )
        ;
});

// Jekyll
gulp.task("jekyll", function() {
    return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit", shell: true });
});

gulp.task("watch", function() {

    browserSync.init({
        server: {
            baseDir: "./docs/"
        }
    });

    // gulp.watch( '_assets/scss/**/*.scss', gulp.series('scss') );
    gulp.watch( '_assets/css/**/*.css', gulp.series('scss') );

    gulp.watch(
        [
            "./*.html",
            "./_includes/*.html",
            "./_layouts/*.html",
            "./_posts/**/*.*"
        ]
    ).on('change', gulp.series('jekyll', 'scss') );

    gulp.watch( 'docs/**/*.html' ).on('change', browserSync.reload );
    gulp.watch( 'docs/**/*.js' ).on('change', browserSync.reload );

});

gulp.task("deploy", gulp.series('jekyll', 'scss'));

gulp.task("default", gulp.series('jekyll', 'scss', 'watch'));