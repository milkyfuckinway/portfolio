import gulp from 'gulp';
import size from 'gulp-size';
import sharp from 'gulp-sharp-responsive';
import newer from 'gulp-newer';
import fs from 'fs-extra';

const contentManualSrc = './src/img/content-manual/**/*.{png,jpg,jpeg,gif}';
const contentAutoSrc = './src/img/content/**/*.{png,jpg,jpeg,gif}';
const contentDest = './build/img/content';
const decorativeSrc = './src/img/decorative/**/*.{png,jpg,jpeg,gif}';
const decorativeDest = './build/img/decorative';
const jpegQuality = 80;
const jpegQuality2x = 80;
const webpQuality = 80;
const webpQuality2x = 80;
const manualQuality = 80;

export default (done) => {
  console.log('Оптимизация изображений');
  gulp
    .src(contentAutoSrc)
    .pipe(size({ title: 'До конвертирования в адаптив' }))
    .pipe(newer(contentAutoSrc))
    .pipe(
      sharp({
        formats: [
          {
            width: (metadata) => Math.round(metadata.width * 0.25),
            jpegOptions: { quality: jpegQuality, progressive: true },
            pngOptions: {
              compressionLevel: 9,
              adaptiveFiltering: true,
              palette: true
            },
            rename: { suffix: '_mobile' },
          },
          {
            width: (metadata) => Math.round(metadata.width * 0.25),
            webpOptions: { quality: webpQuality },
            format: 'webp',
            rename: { suffix: '_mobile' },
          },
          {
            width: (metadata) => Math.round(metadata.width * 0.5),
            jpegOptions: { quality: jpegQuality2x, progressive: true },
            pngOptions: {
              compressionLevel: 9,
              adaptiveFiltering: true,
              palette: true
            },
            rename: { suffix: '_mobile@2x' },
          },
          {
            width: (metadata) => Math.round(metadata.width * 0.5),
            webpOptions: { quality: webpQuality2x },
            format: 'webp',
            rename: { suffix: '_mobile@2x' },
          },
          {
            width: (metadata) => Math.round(metadata.width * 0.35),
            jpegOptions: { quality: jpegQuality, progressive: true },
            pngOptions: {
              compressionLevel: 9,
              adaptiveFiltering: true,
              palette: true
            },
            rename: { suffix: '_tablet' },
          },
          {
            width: (metadata) => Math.round(metadata.width * 0.35),
            webpOptions: { quality: webpQuality },
            format: 'webp',
            rename: { suffix: '_tablet' },
          },
          {
            width: (metadata) => Math.round(metadata.width * 0.7),
            jpegOptions: { quality: jpegQuality2x, progressive: true },
            pngOptions: {
              compressionLevel: 9,
              adaptiveFiltering: true,
              palette: true
            },
            rename: { suffix: '_tablet@2x' },
          },
          {
            width: (metadata) => Math.round(metadata.width * 0.7),
            webpOptions: { quality: webpQuality2x },
            format: 'webp',
            rename: { suffix: '_tablet@2x' },
          },
          {
            width: (metadata) => Math.round(metadata.width * 0.5),
            jpegOptions: { quality: jpegQuality, progressive: true },
            pngOptions: {
              compressionLevel: 9,
              adaptiveFiltering: true,
              palette: true
            },
            rename: { suffix: '_desktop' },
          },
          {
            width: (metadata) => Math.round(metadata.width * 0.5),
            webpOptions: { quality: webpQuality },
            format: 'webp',
            rename: { suffix: '_desktop' },
          },
          {
            width: (metadata) => metadata.width,
            jpegOptions: { quality: jpegQuality2x, progressive: true },
            pngOptions: {
              compressionLevel: 9,
              adaptiveFiltering: true,
              palette: true
            },
            rename: { suffix: '_desktop@2x' },
          },
          {
            width: (metadata) => metadata.width,
            webpOptions: { quality: webpQuality2x },
            format: 'webp',
            rename: { suffix: '_desktop@2x' },
          },
        ],
      })
    )
    .pipe(size({ title: 'После конвентирования в адаптив' }))
    .pipe(gulp.dest(contentDest))
    .on('end', () => {
      gulp
        .src(contentManualSrc)
        .pipe(
          size({ title: 'Создание из заготовленных изображений файлы webp' })
        )
        .pipe(newer(contentManualSrc))
        .pipe(
          sharp({
            includeOriginalFile: true,
            formats: [
              {
                width: (metadata) => metadata.width,
                format: 'webp',
                webpOptions: { quality: manualQuality },
              },
            ],
          })
        )
        .pipe(size({ title: 'После создания webp' }))
        .pipe(gulp.dest(contentDest))
        .on('end', () => {
          gulp
            .src(decorativeSrc)
            .pipe(size({ title: 'Оптимизация декоративных изображений' }))
            .pipe(newer(decorativeSrc))
            .pipe(
              sharp({
                formats: [
                  {
                    width: (metadata) => metadata.width,
                    jpegOptions: { quality: 80, progressive: true },
                    pngOptions: {
                      compressionLevel: 9,
                      adaptiveFiltering: true,
                      palette: true
                    },
                  },
                  {
                    width: (metadata) => metadata.width,
                    format: 'webp',
                    webpOptions: { quality: 80 },
                  },
                ],
              })
            )
            .pipe(
              size({
                title: 'Размер декоративных изображений после оптимизации',
              })
            )
            .pipe(gulp.dest(decorativeDest));
        })
        .on('end', () => {
          if (fs.existsSync('./src/pug/layout/picture.pug')) {
            fs.unlink('./src/pug/layout/picture.pug');
          }
          fs.readdir(contentDest, (err, files) => {
            if (files) {
              fs.readdir(contentDest, (errr, items) => {
                items.forEach((item) => {
                  fs.appendFile(
                    './src/pug/layout/picture.pug',
                    `"Для файлов ${item}"
                    picture
                      source(type="image/webp" media="(min-width: 1150px)" srcset="./img/content/${item}/${item}_desktop.webp, ./img/content/${item}/${item}_desktop@2x.webp 2x")
                      source(type="image/webp" media="(min-width: 768px)" srcset="./img/content/${item}/${item}_tablet.webp, ./img/content/${item}/${item}_tablet@2x.webp 2x")
                      source(type="image/webp" srcset="./img/content/${item}/${item}_mobile.webp, ./img/content/${item}/${item}_mobile@2x.webp 2x")
                      source(media="(min-width: 1150px)" srcset="./img/content/${item}/${item}_desktop.jpg, ./img/content/${item}/${item}_desktop@2x.jpg 2x")
                      source(media="(min-width: 768px)" srcset="./img/content/${item}/${item}_tablet.jpg, ./img/content/${item}/${item}_tablet@2x.jpg 2x")
                      img(class="#" src="./img/content/${item}/${item}_mobile.jpg" alt="" srcset="./img/content/${item}/${item}_mobile@2x.jpg 2x" width="#" height="#")
                    \n`
                  );
                });
              });
            }
          });
          done();
        });
    });
};
