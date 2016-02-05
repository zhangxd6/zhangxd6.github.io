// Sass configuration
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
    gulp.src('assets/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('assets/css'))
});

gulp.task('default', function() {
    gulp.watch('assets/sass/*.scss', ['sass']);
})