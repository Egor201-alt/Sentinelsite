<script setup lang="ts">
import { ref } from 'vue';
import TheHeader from './components/TheHeader.vue';
import TheSidebar from './components/TheSidebar.vue';
import AccountPanel from './components/AccountPanel.vue';
import TransactionsPanel from './components/TransactionsPanel.vue';
import AdPanel from './components/AdPanel.vue';

// Импорт всех модальных окон
import AnalyticsModal from './components/modals/AnalyticsModal.vue';
import TransferModal from './components/modals/TransferModal.vue';
import PaymentModal from './components/modals/PaymentModal.vue';
import AutopayModal from './components/modals/AutopayModal.vue';
import LimitsModal from './components/modals/LimitsModal.vue';
import DesignModal from './components/modals/DesignModal.vue';
import DangerActionModal from './components/modals/DangerActionModal.vue';
import EditNameModal from './components/modals/EditNameModal.vue';

// Переменные состояния для управления видимостью каждого модального окна
const visibleModal = ref<string | null>(null);
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
              <a href="bank.html" class="back-button"><i class="fas fa-arrow-left"></i></a>
              <h1>Управление счетом</h1>
            </header>
            <div class="main-grid">
              <AccountPanel @open-modal="modalName => visibleModal = modalName" />
              <TransactionsPanel @open-modal="modalName => visibleModal = modalName" />
              <AdPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

  <!-- Рендерим все модальные окна, передавая им состояние видимости -->
  <AnalyticsModal :is-visible="visibleModal === 'analytics'" @close="visibleModal = null" />
  <TransferModal :is-visible="visibleModal === 'transfer'" @close="visibleModal = null" />
  <PaymentModal :is-visible="visibleModal === 'payment'" @close="visibleModal = null" />
  <AutopayModal :is-visible="visibleModal === 'autopay'" @close="visibleModal = null" />
  <LimitsModal :is-visible="visibleModal === 'limits'" @close="visibleModal = null" />
  <DesignModal :is-visible="visibleModal === 'design'" @close="visibleModal = null" />
  <DangerActionModal :is-visible="visibleModal === 'danger-block' || visibleModal === 'danger-delete'" :type="visibleModal" @close="visibleModal = null" />
  <EditNameModal :is-visible="visibleModal === 'edit-name'" @close="visibleModal = null" />
</template>