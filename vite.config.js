// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'; // <--- 1. Импортируй плагин

export default defineConfig({
  plugins: [vue()], // <--- 2. Добавь его в массив плагинов
});