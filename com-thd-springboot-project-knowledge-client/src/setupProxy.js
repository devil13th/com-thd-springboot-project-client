const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(proxy('/api/knowledge', {
      target: 'http://127.0.0.1:2348/',
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/"
      },
      'logLevel': 'debug'
    }));
  
    
  
};