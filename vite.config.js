// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'PokerPower', 
      formats: ['iife'],
      fileName: () => 'pokerpower-utility.min.js',
    },
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    host: '0.0.0.0',  // More explicit than 'true'
    port: 3000,
    cors: true,
    https:true
  }
});