var gulp=require('gulp');
var ejs=require('gulp-ejs');
//var gutil=require('gulp-util');
//var gulpis=require('gulp-ejs-template');
var gulpis=require('./ejs-template-parser');
var newer=require('gulp-newer');

/*gulp.src('./public/body.html')
.pipe(ejs({msg:'hello gulp'}).on('error',gutil.log))
.pipe(gulp.dest('./dist'));*/
/*gulp.src('./public/body.html')
.pipe(ejs({etwas:'m'}))
.pipe(gulp.dest('./dist'));*/

gulp.task('emp',function(){
return gulp.src('./templates2/body.html')
.pipe(gulpis({moduleName:'templates'}))
.pipe(gulp.dest('./dist'));
});
//gulp emp
var templsrc="./src1/**";
var dest="./templates2";
gulp.task('new',function(){
return gulp.src(templsrc)
.pipe(newer(dest))
.pipe(gulpis({moduleName:'templates'}))
.pipe(gulp.dest(dest));
});

