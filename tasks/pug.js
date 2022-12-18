import gulp from 'gulp';
import pug from 'gulp-pug';
import path from '../config/path.js';
import app from '../config/app.js';

export default () => {
  console.log('Генерация html из файлов pug');
  return gulp.src(path.pug.src)
    .pipe(pug(app.pug))
    .pipe(gulp.dest(path.pug.dest));
};
