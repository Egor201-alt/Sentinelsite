import { createApp } from 'vue'
import './bank-style.css' // Убедись, что CSS файл так называется
import BankPage from './BankPage.vue' // Импортируем наш новый главный компонент

createApp(BankPage).mount('#app')