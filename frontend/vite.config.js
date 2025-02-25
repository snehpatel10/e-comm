import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/upload': 'http://localhost:5000',
    },
  },

  // Optimizing dependencies and including client-only libraries for faster builds
  optimizeDeps: {
    include: ['react-toastify', 'framer-motion', 'react-intersection-observer'],
  },

  // Treating client-only libraries as external to avoid SSR issues
  ssr: {
    external: ['react-toastify', 'framer-motion', 'react-intersection-observer'],
  },

  build: {
    // Set the output directory to dist for Vercel deployment
    outDir: 'frontend/dist',
    
    // Chunking optimization
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Bundle all dependencies into a single chunk
          }
        },
      },
    },
    
    // If you need to adjust the chunk size limit (in KB)
    chunkSizeWarningLimit: 1000, // Set this to 1000KB (1MB) to suppress warnings
  },
});
