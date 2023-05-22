import path from 'path';
import { defineConfig } from 'vite'
import sri from '@small-tech/vite-plugin-sri'

export default defineConfig({
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    }
  },
  server: {
    port: 8080
  },
  plugins: [sri()]
})