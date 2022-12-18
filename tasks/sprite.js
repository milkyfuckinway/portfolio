import gulp from 'gulp';
import path from '../config/path.js';
import gulpSvgSprite from 'gulp-svg-sprite';
import svgo from 'gulp-svgo';
import fs from 'fs-extra';

export default (done) => {
  console.log('Генерация монохромного спрайта');
  gulp
    .src(path.spritemono.src)
    .pipe(
      svgo({
        plugins: [
          {
            removeAttrs: {
              attrs: ['class', 'data-name', 'fill', 'stroke.*'],
            },
          },
        ],
      })
    )
    .pipe(
      gulpSvgSprite({
        mode: {
          symbol: {
            sprite: '../sprite-mono.svg',
          },
        },
      })
    )
    .pipe(gulp.dest(path.spritemono.dest))
    .on('end', () => {
      console.log('Генерация цветного спрайта');
      gulp
        .src(path.spritemulti.src)
        .pipe(
          svgo({
            plugins: [
              {
                removeAttrs: {
                  attrs: ['class', 'data-name'],
                },
              },
              {
                removeUselessStrokeAndFill: false,
              },
              {
                inlineStyles: true,
              },
            ],
          })
        )
        .pipe(
          gulpSvgSprite({
            mode: {
              symbol: {
                sprite: '../sprite-multi.svg',
              },
            },
          })
        )
        .pipe(gulp.dest(path.spritemulti.dest));
    })
    .on('end', () => {
      if (fs.existsSync(path.htmlsprite.appendto)) {
        fs.unlink(path.htmlsprite.appendto);
      }
      console.log('Генерация файла с подключенными спрайтами');
      fs.readdir('./src/img/sprite/mono', (err, items) => {
        if (items) {
          items.forEach((item) => {
            fs.appendFile(path.htmlsprite.appendto,
              `|Спрайт для ${item.split('.')[0]}\nsvg(width='#' height='#')\n    use(xlink:href="img/sprite-mono.svg#${item.split('.')[0]}")\n\r`
            );
          });
        }
      });
      fs.readdir('./src/img/sprite/multi', (err, items) => {
        if (items) {
          items.forEach((item) => {
            fs.appendFile(path.htmlsprite.appendto,
              `|Спрайт для ${item.split('.')[0]}\nsvg(width='#' height='#')\n    use(xlink:href="img/sprite-multi.svg#${item.split('.')[0]}")\n\r`
            );
          });
        }
      });
    });
  done();
};
