import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://e-comm-my7s.vercel.app',
      '/upload': 'https://e-comm-my7s.vercel.app',
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
