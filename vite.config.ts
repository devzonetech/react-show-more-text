import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'ShowMoreText',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'prop-types',
      ],
      output: [
        {
          format: 'es',
          entryFileNames: 'index.es.js',
          dir: 'dist',
        },
        {
          format: 'cjs',
          entryFileNames: 'index.cjs.js',
          dir: 'dist',
        },
      ],
    },
    sourcemap: true,
    minify: 'terser',
  },
});
