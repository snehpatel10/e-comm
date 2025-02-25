import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/upload': 'http://localhost:5000',
    },
  },
  
  optimizeDeps: {
    include: ['react-toastify', 'framer-motion'], 
  },
  
  ssr: {
    external: ['react-toastify', 'framer-motion'], 
  },
  
  build: {
    rollupOptions: {
      external: ['react-toastify', 'framer-motion'], 
    },
  },
});
