<script setup lang="ts">
defineProps<{ isVisible: boolean }>();
const emit = defineEmits(['close']);
</script>

<template>
  <div class="modal-overlay" :class="{ 'visible': isVisible }" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <header class="modal-header">
        <h2>Новый платеж</h2>
        <button class="close-modal-btn" @click="emit('close')"><i class="fas fa-times"></i></button>
      </header>
      <div class="modal-body">
        <p>Выберите категорию для совершения платежа.</p>
        <div class="payment-options">
          <a href="#" class="payment-card">
            <div class="payment-card-icon tax-icon"><i class="fas fa-landmark"></i></div>
            <div class="payment-card-info"><span class="payment-card-title">Налоги</span><small class="payment-card-desc">Оплата городских и государственных налогов</small></div>
            <i class="fas fa-chevron-right payment-card-arrow"></i>
          </a>
          <a href="#" class="payment-card">
            <div class="payment-card-icon fine-icon"><i class="fas fa-gavel"></i></div>
            <div class="payment-card-info"><span class="payment-card-title">Штрафы</span><small class="payment-card-desc">Погашение штрафов от системы правосудия</small></div>
            <i class="fas fa-chevron-right payment-card-arrow"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>