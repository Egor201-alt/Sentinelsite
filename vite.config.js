// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'; // <--- 1. Импортируй плагин

export default defineConfig({
    plugins: [vue()], // <--- 2. Добавь его в массив плагинов
    build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        profile: resolve(__dirname, 'profile.html'), // Добавь эту строку для каждого нового html файла
      },
    },
  },
});
