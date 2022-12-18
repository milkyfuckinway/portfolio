import gulp from 'gulp';
import path from '../config/path.js';
import size from 'gulp-size';
import svgo from 'gulp-svgo';
import newer from 'gulp-newer';

export default () => {
  console.log('Оптимизация файлов svg');
  return gulp
    .src(path.svg.src)
    .pipe(newer(path.img.dest))
    .pipe(size({ title: 'Размер до оптимизации' }))
    .pipe(
      svgo({
        plugins: [
          { removeViewBox: false },
          { removeDimensions: true },
        ]
      })
    )
    .pipe(size({ title: 'Размер после оптимизации' }))
    .pipe(gulp.dest(path.svg.dest));
};
