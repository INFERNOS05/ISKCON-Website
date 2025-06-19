import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({  server: {
    host: "::",
    port: 8081,
    proxy: {
      '/api': {
        target: 'https://prcdxmmidbgfglhuoycm.supabase.co/functions/v1',
        changeOrigin: true,
        secure: true, // Enable HTTPS
        rewrite: (path) => {
          // Rewrite all /api/* paths to /quick-api/*
          const endpoint = path.replace(/^\/api(?=\/|$)/, '/quick-api');
          console.log(`Proxying ${path} to Edge Function endpoint: ${endpoint}`);
          return endpoint;
        },
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url, req.headers);
            
            // Add required headers for Supabase Edge Function authentication            // Set content type and accept headers
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Accept', 'application/json');
            
            // Add Supabase anon key as Authorization header
            const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByY2R4bW1pZGJnZmdsaHVveWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNTMxMTAsImV4cCI6MjA2NTYyOTExMH0.MxuaZ4eN_H2B3XA-WnLuiAG7ZpOuFewaayXbqbA0Ydc';
            
            // Remove any existing auth headers to prevent duplicates
            proxyReq.removeHeader('apikey');
            proxyReq.removeHeader('authorization');
              // Set fresh auth headers
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
