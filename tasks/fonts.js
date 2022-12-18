import gulp from 'gulp';
import path from '../config/path.js';
import app from '../config/app.js';
import newer from 'gulp-newer';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';
import fs from 'fs-extra';

export default (done) => {
  console.log('Конвертация шрифтов');
  gulp
    .src(path.fonts.src)
    .pipe(newer(path.img.dest))
    .pipe(fonter(app.fonter))
    .pipe(gulp.dest(path.fonts.dest))
    .pipe(gulp.src(path.fonts.src))
    .pipe(ttf2woff2())
    .pipe(gulp.dest(path.fonts.dest))
    .on('end', () => {
      console.log('Подключение шрифтов');
      if (fs.existsSync(path.fonts.appendto)) {
        fs.unlink(path.fonts.appendto);
      }
      fs.appendFile(path.fonts.appendto, '@use "mixins.scss" as *;\n');
      gulp.src(path.fonts.dest);
      const fontdir = path.fonts.dest;
      fs.readdir(fontdir, (err, items) => {
        if (items) {
          items.forEach((item) => {
            const fileName = item.toLocaleLowerCase();
            const fontName = fileName.split('.')[0];
            const fontStyle = fontName.split('-')[1];
            const fontExt = item.split('.')[1];
            const styleToWeight = {
              thin: '100',
              extralight: '200',
              light: '300',
              normal: '400',
              regular: '400',
              medium: '500',
              semibold: '600',
              bold: '700',
              extrabold: '800',
              black: '900',
              extrablack: '950',
            };
            if (fontExt === 'woff' || fontExt === 'woff2') {
              fs.appendFile(
                path.fonts.appendto,
                `@include font-face("${fontName}", "${item}", "${fontStyle}", "${styleToWeight[fontStyle]}", "${fontExt}");\n`
              );
            }
          });
        }
      });
      done();
    });
};
