import { createProxyMiddleware } from 'http-proxy-middleware';
import type { Request, Response } from 'express';

/**
 * Proxy configuration for development server.
 * Forwards API requests to the backend (http://localhost:5000).
 */
export default function (app: any) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Remove /api prefix when forwarding
      },
    })
  );
}
