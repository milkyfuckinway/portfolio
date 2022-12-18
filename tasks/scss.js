import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import scss from 'sass';
import sassGlob from 'gulp-sass-glob';
import path from '../config/path.js';
import autoprefixer from 'gulp-autoprefixer';
import csso from 'gulp-csso';
import rename from 'gulp-rename';
import size from 'gulp-size';
import shorthand from 'gulp-shorthand';
import groupMedias from 'gulp-group-css-media-queries';
import webpCss from 'gulp-webp-css';
import app from '../config/app.js';

const sass = gulpSass(scss);

export default () => {
  console.log('Генерация css из файлов scss');
  return gulp.src(path.sass.src, {sourcemaps: app.isDev})
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(webpCss())
    .pipe(autoprefixer())
    .pipe(shorthand())
    .pipe(groupMedias())
    .pipe(size({title : 'Размер до оптимизации'}))
    .pipe(gulp.dest(path.sass.dest, {sourcemaps: app.isDev}))
    .pipe(rename({suffix: '.min'}))
    .pipe(csso())
    .pipe(size({title : 'Размер после оптимизации'}))
    .pipe(gulp.dest(path.sass.dest, {sourcemaps: app.isDev}));
};
