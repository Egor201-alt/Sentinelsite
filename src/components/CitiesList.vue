<script setup lang="ts">
import { ref, computed } from 'vue';

const emit = defineEmits(['openMap']);

type City = {
  id: number;
  name: string;
  mayor: string;
  residents: number;
  status: 'Открыт' | 'Закрыт';
  bgClass: string;
  inhabited: boolean; // Проживает ли в нем текущий игрок
};

const allCities = ref<City[]>([
    { id: 1, name: 'Тест201', mayor: 'Egor201', residents: 201, status: 'Открыт', bgClass: 'card-bg-city-1', inhabited: true },
    { id: 2, name: 'ОплеЛенд', mayor: 'opl67', residents: 1488, status: 'Открыт', bgClass: 'card-bg-city-2', inhabited: false },
    { id: 3, name: 'Мексиканский Картель', mayor: 'Мега крутой Картем', residents: 16, status: 'Закрыт', bgClass: 'card-bg-city-3', inhabited: false },
    { id: 4, name: 'ЛоуТаб', mayor: 'Блари', residents: 1, status: 'Закрыт', bgClass: 'card-bg-city-4', inhabited: false },
]);

const searchTerm = ref('');
const activeTab = ref('Все города'); // 'Все города' | 'Проживаю'

const filteredCities = computed(() => {
    return allCities.value.filter(city => {
        const searchMatch = city.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                            city.mayor.toLowerCase().includes(searchTerm.value.toLowerCase());
        
        const tabMatch = activeTab.value === 'Все города' || city.inhabited;

        return searchMatch && tabMatch;
    });
});
</script>

<template>
  <div class="cities-content">
    <div class="content-header">
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input type="text" class="styled-input" placeholder="Найти город по названию или мэру..." v-model="searchTerm">
      </div>
      <button class="primary-action" @click="emit('openMap')">
        <i class="fa-solid fa-map-location-dot"></i>
        Открыть карту
      </button>
    </div>
    <div class="content-body">
      <div class="filter-tabs">
        <button class="filter-tab" :class="{active: activeTab === 'Все города'}" @click="activeTab = 'Все города'">Все города</button>
        <button class="filter-tab" :class="{active: activeTab === 'Проживаю'}" @click="activeTab = 'Проживаю'">Проживаю</button>
      </div>
      <div class="city-grid">
        <a v-for="city in filteredCities" :key="city.id" href="#" class="city-card" :class="city.bgClass">
          <div class="glass-container">
            <h3 class="city-name">{{ city.name }}</h3>
            <span class="city-mayor"><i class="fas fa-crown"></i> {{ city.mayor }}</span>
          </div>
          <div class="city-stats">
            <span class="stat-item"><i class="fas fa-users"></i> {{ city.residents }}</span>
            <span class="city-status" :class="city.status === 'Открыт' ? 'status-open' : 'status-closed'">
              <i :class="city.status === 'Открыт' ? 'fas fa-door-open' : 'fas fa-door-closed'"></i> {{ city.status }}
            </span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>