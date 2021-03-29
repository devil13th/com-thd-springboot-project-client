const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(proxy('/api/note', {
      target: 'http://127.0.0.1:2347/',
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/"
      },
      'logLevel': 'debug'
    }));
  
    app.use(proxy('/tt', {
      target: 'http://127.0.0.1:8899/xx',
      changeOrigin: true,
      pathRewrite: {
        "^/tt": "/"
      },
      'logLevel': 'debug'
    }));
  
  
};