import gulp from 'gulp';
import path from '../config/path.js';

export default (done) => {
  console.log('Перенос фавиконок');
  gulp.src(path.favicons.src)
    .pipe(gulp.dest(path.favicons.dest));
  gulp.src('./src/*.*{webmanifest,ico}')
    .pipe(gulp.dest('./build/'));
  done();
};
