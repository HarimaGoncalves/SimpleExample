const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Proxy configuration for development server.
 * Forwards API requests to the backend (http://localhost:5000).
 */
module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api', // Keep /api in the path
      },
    })
  );
};
