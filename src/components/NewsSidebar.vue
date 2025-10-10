<script setup lang="ts">
import { ref } from 'vue';
import CustomSelect from './CustomSelect.vue'; // Переиспользуем наш селект!

const sortOptions = [
    { value: 'best', text: 'Лучшее', icon: 'fas fa-fire' },
    { value: 'random', text: 'Случайно', icon: 'fas fa-random' },
    { value: 'worst', text: 'Худшее', icon: 'fas fa-thumbs-down' },
];
const sourceOptions = [
    { value: 'all', text: 'Все посты', icon: 'fa-solid fa-earth-europe' },
    { value: 'players', text: 'От игроков', icon: 'fas fa-user' },
    { value: 'cities', text: 'От городов', icon: 'fas fa-city' },
];
const timeOptions = [
    { value: 'all-time', text: 'За все время', icon: 'fas fa-infinity' },
    { value: 'month', text: 'За последний месяц', icon: 'fas fa-calendar-alt' },
    { value: 'week', text: 'За последнюю неделю', icon: 'fas fa-calendar-week' },
];

const selectedSort = ref('best');
const selectedSource = ref('all');
const selectedTime = ref('all-time');
</script>

<template>
  <!-- Возвращаем оригинальную структуру с aside -->
  <aside class="right-sidebar">
    
    <!-- Оборачиваем все фильтры в .filters-panel, как было в оригинальном HTML -->
    <div class="filters-panel">
      <CustomSelect label="Сортировка" :options="sortOptions" v-model="selectedSort" />
      <CustomSelect label="Источник" :options="sourceOptions" v-model="selectedSource" />
      <CustomSelect label="Время" :options="timeOptions" v-model="selectedTime" />
      <button class="contact-admin-btn">Связь с админом</button>
    </div>

    <!-- Рекламный блок теперь находится здесь, а не в отдельном компоненте -->
    <div class="ad-widget">
      <div class="ad-content">
        <i class="fa-solid fa-bullhorn"></i>
        <span>Здесь могла быть ваша реклама</span>
      </div>
    </div>

  </aside>
</template>