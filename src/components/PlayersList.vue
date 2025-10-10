<script setup lang="ts">
import { ref, computed } from 'vue';
import CustomSelect from './CustomSelect.vue';

// --- ТИПЫ И ДАННЫЕ ---
type PlayerStatus = 'online' | 'afk' | 'offline';
type PlayerRole = 'player' | 'guard' | 'banker' | 'minister';
type SortKey = 'name_asc' | 'name_desc' | 'playtime_asc' | 'playtime_desc';

type Player = {
  id: number;
  name: string;
  role: PlayerRole;
  status: PlayerStatus; // <-- НОВОЕ ПОЛЕ
  playtime: number;      // <-- НОВОЕ ПОЛЕ (в часах)
};

const allPlayers = ref<Player[]>([
  { id: 1, name: 'Egor201', role: 'minister', status: 'online', playtime: 115 },
  { id: 2, name: 'opl67', role: 'guard', status: 'afk', playtime: 230 },
  { id: 3, name: 'Notch', role: 'player', status: 'offline', playtime: 999 },
  { id: 4, name: 'Herobrine', role: 'player', status: 'offline', playtime: 0 },
  { id: 5, name: 'Steve', role: 'player', status: 'online', playtime: 50 },
  { id: 6, name: 'Alex', role: 'banker', status: 'afk', playtime: 150 },
  { id: 7, name: 'Technoblade', role: 'player', status: 'offline', playtime: 8760 },
]);

// Опции для селектов
const roleOptions = [
  { value: 'all', text: 'Все игроки', icon: 'fa-solid fa-users' },
  { value: 'player', text: 'Игрок', icon: 'fa-solid fa-user' },
  { value: 'guard', text: 'Гвардеец', icon: 'fa-solid fa-shield' },
  { value: 'banker', text: 'Банкир', icon: 'fa-solid fa-building-columns' },
  { value: 'minister', text: 'Администратор', icon: 'fa-solid fa-user-tie' },
];

const sortOptions = [
  { value: 'name_asc', text: 'Ник ( a-z )', icon: 'fa-solid fa-arrow-down-a-z' },
  { value: 'name_desc', text: 'Ник ( z-a )', icon: 'fa-solid fa-arrow-up-a-z' },
  { value: 'playtime_desc', text: 'Статус в игре (убыв.)', icon: 'fa-solid fa-arrow-down-9-1' },
  { value: 'playtime_asc', text: 'Статус в игре (возр.)', icon: 'fa-solid fa-arrow-up-1-9' },
];

// --- СОСТОЯНИЕ ФИЛЬТРОВ И СОРТИРОВКИ ---
const searchTerm = ref('');
const selectedRole = ref('all');
const selectedSort = ref<SortKey>('name_asc'); // <-- НОВОЕ СОСТОЯНИЕ

// --- ЛОГИКА ФИЛЬТРАЦИИ И СОРТИРОВКИ ---
const filteredAndSortedPlayers = computed(() => {
  let players = allPlayers.value
    // 1. Фильтрация
    .filter(player => {
      const nameMatch = player.name.toLowerCase().includes(searchTerm.value.toLowerCase());
      const roleMatch = selectedRole.value === 'all' || player.role === selectedRole.value;
      return nameMatch && roleMatch;
    });

  // 2. Сортировка
  switch (selectedSort.value) {
    case 'name_asc':
      players.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name_desc':
      players.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'playtime_desc':
      players.sort((a, b) => b.playtime - a.playtime);
      break;
    case 'playtime_asc':
      players.sort((a, b) => a.playtime - a.playtime);
      break;
  }
  return players;
});
</script>

<template>
  <div class="players-main-content">
    <div class="player-filters">
      <div class="search-input-wrapper">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input 
          type="text" 
          class="styled-input" 
          placeholder="Поиск по нику"
          v-model="searchTerm"
        >
      </div>
      
      <CustomSelect 
        label="Роли" 
        :options="roleOptions" 
        v-model="selectedRole"
        type="players"
      />
      
      <!-- Добавляем type="players" -->
      <CustomSelect 
        label="Сортировка" 
        :options="sortOptions" 
        v-model="selectedSort"
        type="players"
      />
    </div>

    <div class="player-list">
      <div v-if="filteredAndSortedPlayers.length === 0" class="no-results-message">
        <i class="fa-solid fa-wheelchair-move"></i>
        <span>Игрок не найден</span> 
      </div>
      
      <a v-else v-for="player in filteredAndSortedPlayers" :key="player.id" href="#" class="player-card">
        <!-- НОВЫЙ БЛОК ДЛЯ АВАТАРА И СТАТУСА -->
        <div class="player-avatar-wrapper">
          <img :src="`https://visage.surgeplay.com/face/32/${player.name}.png`" alt="Аватарка">
          <!-- Динамически добавляем класс в зависимости от статуса -->
          <div class="player-status" :class="player.status"></div>
        </div>
        <span class="player-name">{{ player.name }}</span>
      </a>
    </div>

    <!-- ЗАГОТОВКА ПОД ПАГИНАЦИЮ (сейчас скрыта, но готова к работе) -->
    <!-- <div class="pagination"> ... </div> -->
  </div>
</template>

<style scoped>
/* СТИЛИ ДЛЯ ИНДИКАТОРА СТАТУСА */
.player-avatar-wrapper {
  position: relative;
  width: 32px; /* Размер аватара */
  height: 32px;
  flex-shrink: 0;
}

.player-avatar-wrapper img {
  width: 100%;
  height: 100%;
  image-rendering: pixelated; /* Чтобы аватарки были "пиксельными" */
}

.player-status {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--surface-color); /* Обводка в цвет фона карточки */
  transition: background-color 0.3s ease;
}

.player-status.online {
  background-color: var(--success-color);
}
.player-status.offline {
  background-color: #6c757d; /* Серый */
}
.player-status.afk {
  background-color: var(--primary-color); /* Желто-оранжевый */
}

.no-results-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  color: var(--text-muted);
  padding: 40px;
  width: 100%;
}
.no-results-message i {
  font-size: 2.5rem;
}
</style>