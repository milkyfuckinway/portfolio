const loading = document.querySelector('.loading');
const removeLoadingScreen = () => {
  loading.remove();
};
setTimeout(() => {
  removeLoadingScreen();
}, 3000);

removeLoadingScreen();
