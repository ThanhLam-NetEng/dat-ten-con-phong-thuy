import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// Vite plugin to support clean URLs locally in dev server
const cleanUrlsDevPlugin = () => ({
  name: 'clean-urls-dev',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url.split('?')[0];
      if (url === '/xem-ngay-sinh-mo') {
        req.url = '/xem-ngay-sinh-mo.html';
      } else if (url === '/cham-diem-ten') {
        req.url = '/cham-diem-ten.html';
      } else if (url === '/doi-am-duong-lich') {
        req.url = '/doi-am-duong-lich.html';
      } else if (url === '/xem-tuoi-vo-chong') {
        req.url = '/xem-tuoi-vo-chong.html';
      } else if (url === '/xem-ngay-tot-xau') {
        req.url = '/xem-ngay-tot-xau.html';
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    cleanUrlsDevPlugin()
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        csection: resolve(__dirname, 'xem-ngay-sinh-mo.html'),
        check: resolve(__dirname, 'cham-diem-ten.html'),
        lunarConv: resolve(__dirname, 'doi-am-duong-lich.html'),
        couple: resolve(__dirname, 'xem-tuoi-vo-chong.html'),
        dates: resolve(__dirname, 'xem-ngay-tot-xau.html')
      }
    }
  }
})
