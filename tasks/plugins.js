import gulp from 'gulp';
import path from '../config/path.js';

export default () => {
  console.log('Перенос плагинов');
  return gulp.src(path.plugins.src)
    .pipe(gulp.dest(path.plugins.dest));
};
