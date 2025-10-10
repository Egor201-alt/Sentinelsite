<script setup lang="ts">
import { ref } from 'vue';
// Мы снова будем использовать компоненты шапки и сайдбара
import TheHeader from './components/TheHeader.vue';
import TheSidebar from './components/TheSidebar.vue';

// Импортируем новые компоненты для этой страницы
import AccountsSection from './components/AccountsSection.vue';
import ActivitySection from './components/ActivitySection.vue';
import FinesSection from './components/FinesSection.vue';
import NewAccountModal from './components/modals/NewAccountModal.vue';

const isNewAccountModalVisible = ref(false);
</script>

<template>
  <div class="page-wrapper">
    <TheHeader />
    <div class="dashboard-body">
      <TheSidebar active-page="bank" />
      <main class="main-content">
        <div class="container">
          <div class="content-panel">
            <header class="page-header">
              <h1>Ваши счета</h1>
            </header>
            <div class="bank-grid">
              <AccountsSection @open-modal="isNewAccountModalVisible = true" />
              <ActivitySection />
              <FinesSection />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

  <NewAccountModal :is-visible="isNewAccountModalVisible" @close="isNewAccountModalVisible = false" />
</template>