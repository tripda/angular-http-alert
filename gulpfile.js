var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var source_files = [
    "./angular-http-alert.js",
];

gulp.task('build', ['minify']);

gulp.task('minify', function() {
    return gulp.src(source_files)
        .pipe(concat('angular-http-alert.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./'))
});

