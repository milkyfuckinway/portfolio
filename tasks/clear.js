import del from 'del';
import path from '../config/path.js';

export default () => {
  console.log('Удаление папки build');
  return del(path.root);
};
