const isProd = process.argv.includes('--production');
const isDev = !isProd;

export default {
  isProd: isProd,
  isDev: isDev,
  htmlmin: {
    collapseWhitespace: isProd
  },
  pug: {
    pretty: isDev
  },
  fonter: {
    formats: ['woff']
  }
};
