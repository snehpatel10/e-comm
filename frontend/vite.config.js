import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/upload': 'http://localhost:5000',
    },
  },

  optimizeDeps: {
    include: ['react-toastify', 'framer-motion', 'react-intersection-observer', 'lottie-web'],
  },

  ssr: {
    external: ['react-toastify', 'framer-motion', 'react-intersection-observer'],
  },

  build: {
    outDir: 'build',
    
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    
    chunkSizeWarningLimit: 1000, 
  },
});
