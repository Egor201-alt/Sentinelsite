<script setup lang="ts">
import { ref } from 'vue';
// Переиспользуем наши готовые компоненты
import TheHeader from './components/TheHeader.vue';
import TheSidebar from './components/TheSidebar.vue';
import AdPanel from './components/AdPanel.vue';

// Импортируем новый компонент для этой страницы
import PlayersList from './components/PlayersList.vue';
</script>

<template>
  <div class="page-wrapper">
    <TheHeader />
    <div class="dashboard-body">
      <TheSidebar active-page="players" />
      <main class="main-content">
        <div class="container">
          <div class="content-panel">
            <header class="page-header">
              <h1>Игроки</h1>
            </header>
            <div class="page-content-wrapper">
              <div class="players-grid">
                <!-- Основной уникальный контент страницы -->
                <PlayersList />
                <!-- Рекламный блок, который мы уже сделали -->
                <AdPanel />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>