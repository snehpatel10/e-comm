import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://e-comm-jpql.onrender.com',
      '/upload': 'https://e-comm-jpql.onrender.com',
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
/*************  ✨ Codeium Command ⭐  *************/
        // Manual chunking for optimization. Vendor libraries are grouped together
        // in a single chunk, while our code is left unbundled.
        // https://rollupjs.org/guide/en/#output.manualchunks
/******  a1170777-48db-478f-89d6-cd1971b9701e  *******/
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
