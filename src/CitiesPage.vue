<script setup lang="ts">
import { ref } from 'vue';
// Переиспользуем наши готовые компоненты
import TheHeader from './components/TheHeader.vue';
import TheSidebar from './components/TheSidebar.vue';

// Импортируем новые компоненты для этой страницы
import CitiesList from './components/CitiesList.vue';
import CitiesSidebar from './components/CitiesSidebar.vue';
import MapModal from './components/modals/MapModal.vue';

const isMapModalVisible = ref(false);
</script>

<template>
  <div class="page-wrapper">
    <TheHeader />
    <div class="dashboard-body">
      <TheSidebar active-page="cities" />
      <main class="main-content">
        <div class="cities-page-layout">
          <CitiesList @open-map="isMapModalVisible = true" />
          <CitiesSidebar />
        </div>
      </main>
    </div>
  </div>

  <MapModal :is-visible="isMapModalVisible" @close="isMapModalVisible = false" />
</template>