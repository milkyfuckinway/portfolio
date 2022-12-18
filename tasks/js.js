import gulp from 'gulp';
import path from '../config/path.js';
import sourcemaps from 'gulp-sourcemaps';
import terser from 'gulp-terser';
import size from 'gulp-size';
import app from '../config/app.js';
import gulpif from 'gulp-if';

export default () => {
  console.log('Сборка файлов js');
  return gulp.src(path.js.src)
    .pipe(sourcemaps.init())
    .pipe(size(({title : 'Размер до оптимизации'})))
    .pipe(gulpif(app.isProd, terser()))
    .pipe(size(({title : 'Размер после оптимизации'})))
    .pipe(gulpif(app.isDev, sourcemaps.write('./')))
    .pipe(gulp.dest(path.js.dest, {sourcemaps: app.isDev}));
};
