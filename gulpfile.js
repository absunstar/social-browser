const gulp = require('gulp')

// gulp.task('ibrowser' , ()=>{
//     ('Coping browser to node_modules  ...')
//     gulp.src(['./browser/*' , './browser/*/*.*'])
//     .pipe(gulp.dest('./node_modules/ibrowser'))
// })
// gulp.task('default' , 'ibrowser');



function build() {
   return gulp.src(['../ibrowser/*' , '../ibrowser/*/*.*'])
    .pipe(gulp.dest('./node_modules/ibrowser'))
}

gulp.task('default', build);