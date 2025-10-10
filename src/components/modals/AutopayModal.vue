<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ isVisible: boolean }>();
const emit = defineEmits(['close']);

// --- СОСТОЯНИЕ КОМПОНЕНТА ---

const activeDropdownId = ref<number | null>(null);

const autopayments = [
  { id: 1, type: 'tax', title: 'Налог города "Syspencion"', amount: -12, nextPayment: 'через 3 дня', progress: 57, icon: 'fas fa-landmark' },
  { id: 2, type: 'transfer', title: 'Перевод игроку "opl67"', amount: -50, nextPayment: 'через 15 дней', progress: 28, icon: 'fas fa-paper-plane' },
];

// --- МЕТОДЫ (функции) ---

function toggleDropdown(paymentId: number) {
  if (activeDropdownId.value === paymentId) {
    activeDropdownId.value = null;
  } else {
    activeDropdownId.value = paymentId;
  }
}
</script>

<template>
  <div class="modal-overlay" :class="{ 'visible': isVisible }" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <header class="modal-header">
        <h2>Активные автоплатежи</h2>
        <button class="close-modal-btn" @click="emit('close')"><i class="fas fa-times"></i></button>
      </header>
      <div class="modal-body">
        <div class="autopay-list">
          
          <div 
            v-for="payment in autopayments" 
            :key="payment.id"
            class="autopay-card"
          >
            <div class="autopay-card-header">
              <div class="autopay-card-icon" :class="`${payment.type}-icon`">
                <i :class="payment.icon"></i>
              </div>
              <div class="autopay-card-info">
                <span class="autopay-title">{{ payment.title }}</span>
                <span class="autopay-amount">{{ payment.amount }} АР</span>
              </div>
              <button class="autopay-options-btn" @click.stop="toggleDropdown(payment.id)">
                <i class="fas fa-ellipsis-v"></i>
              </button>
            </div>
            <div class="autopay-card-footer">
              <small>Следующее списание: <strong>{{ payment.nextPayment }}</strong></small>
              <div class="autopay-progress-bar">
                <div class="autopay-progress" :style="{ width: payment.progress + '%' }"></div>
              </div>
            </div>
            <div class="autopay-dropdown" :class="{ visible: activeDropdownId === payment.id }">
              <button><i class="fa-solid fa-repeat"></i> Указать кол-во повторений</button>
              <button class="danger"><i class="fas fa-trash-alt"></i> Удалить</button>
            </div>
          </div>

        </div>
        <button class="action-btn primary-action add-autopay-btn">
          <i class="fas fa-plus"></i> Добавить автоплатеж
        </button>
      </div>
    </div>
  </div>
</template>