function sum(a, b) {
  return a + b;
}

module.exports = sum;

const startApp = () => {
  const body = document.querySelector('body');
  body.innerHTML = '<h2>JAVASCRIPT ENABLED</h2>';
};

startApp();
