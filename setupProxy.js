const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://dev_interview.qagoodx.co.za',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
      // no x-api-key needed
    })
  );
};


