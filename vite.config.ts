import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false, // Local server doesn't need HTTPS
        rewrite: (path) => {
          // No rewrite needed as server.cjs already handles /api routes
          console.log(`Proxying ${path} to local Express server`);
          return path;
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url, req.headers);
            
            // Add required headers for Supabase Edge Function authentication
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Accept', 'application/json');
            
            // Add Supabase anon key as Authorization header
            const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2R4bW1pZGJnZmdsaHVveWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNTMxMTAsImV4cCI6MjA2NTYyOTExMH0.MxuaZ4eN_H2B3XA-WnLuiAG7ZpOuFewaayXbqbA0Ydc';
            
            // Ensure headers are set for the Edge Function
            console.log(`Adding auth headers to proxy request with key: ${supabaseAnonKey.substring(0, 10)}...`);
            proxyReq.setHeader('apikey', supabaseAnonKey);
            proxyReq.setHeader('Authorization', `Bearer ${supabaseAnonKey}`);
            
            // Log all outgoing headers
            console.log('Outgoing proxy headers:', proxyReq.getHeaders());
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        }
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
