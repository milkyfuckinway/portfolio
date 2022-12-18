const pathSrc = './src';
const pathDest = './build';

export default {
  root: pathDest,

  html: {
    src: `${pathSrc }/html/*.html`,
    watch: `${pathSrc }/html/**/*.html`,
    dest: pathDest
  },
  pug: {
    src: `${pathSrc }/pug/*.pug`,
    watch: `${pathSrc }/pug/**/*.pug`,
    dest: pathDest
  },
  sass: {
    src: `${pathSrc }/sass/*.scss`,
    watch: `${pathSrc }/sass/**/*.scss`,
    dest: `${pathDest }/css`
  },
  js: {
    src: `${pathSrc }/js/**/*.js`,
    watch: `${pathSrc }/js/**/*.js`,
    dest: `${pathDest }/js`
  },
  img: {
    src: `${pathSrc }/img/**/*.{png,jpg,jpeg,gif}`,
    watch: `${pathSrc }/img/**/*.{png,jpg,jpeg,gif}`,
    dest: `${pathDest }/img`
  },
  svg: {
    src: `${pathSrc }/img/svg/**/*.svg`,
    watch: `${pathSrc }/img/svg/**/*.svg`,
    dest: `${pathDest }/img/svg`
  },
  fonts: {
    src: `${pathSrc }/fonts/**/*.{ttf,otf,woff,woff2}`,
    watch: `${pathSrc }/fonts/**/*.{ttf,otf,woff,woff2}`,
    dest: `${pathDest }/fonts`,
    appendto: `${pathSrc }/sass/default/fonts.scss`
  },
  sprite: {
    src: `${pathSrc }/img/sprite/**/**/*.svg`,
    watch: `${pathSrc }/img/sprite/**/**/*.svg`,
    dest: `${pathDest }/img/`
  },
  spritemono: {
    src: `${pathSrc }/img/sprite/mono/*.svg`,
    watch: `${pathSrc }/img/sprite/mono/*.svg`,
    dest: `${pathDest }/img/`
  },
  spritemulti: {
    src: `${pathSrc }/img/sprite/multi/*.svg`,
    watch: `${pathSrc }/img/sprite/multi/*.svg`,
    dest: `${pathDest }/img/`
  },
  htmlsprite: {
    appendto: `${pathSrc }/pug/layout/sprite.pug`
  },
  plugins: {
    src: `${pathSrc }/plugins/**`,
    watch: `${pathSrc }/plugins/**/*`,
    dest: `${pathDest }/plugins`
  }
};
