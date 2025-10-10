<script setup lang="ts">
import { ref, computed } from 'vue';

defineProps<{ isVisible: boolean }>();
const emit = defineEmits(['close']);

const accountName = ref('');

const charCounterText = computed(() => {
  const maxLength = 21;
  return `${accountName.value.length}/${maxLength}`;
});

const isLimitReached = computed(() => {
  return accountName.value.length >= 21;
});
</script>

<template>
  <div class="modal-overlay" :class="{ 'hidden': !isVisible }" @click="emit('close')">
    <div class="modal-content styled-modal" @click.stop>
      <header class="modal-header">
        <h2>Новый счет</h2>
        <button class="close-modal-btn" @click="emit('close')"><i class="fas fa-times"></i></button>
      </header>
      <div class="modal-body">
        <div class="form-group">
          <div class="form-label-wrapper">
            <label for="account-name-input">Придумайте название вашего счета</label>
          </div>
          <div class="input-with-counter">
            <input 
              type="text" 
              id="account-name-input" 
              class="styled-input" 
              placeholder="Например «оплу на деп»" 
              maxlength="21"
              v-model="accountName"
            >
            <span id="char-counter" :class="{ 'limit-reached': isLimitReached }">
              {{ charCounterText }}
            </span>
          </div>
        </div>
        <div class="important-notice">
          <i class="fas fa-info-circle"></i>
          <p>Название счета можно будет изменить позже, но <strong>случайный ID счета изменить будет невозможно.</strong></p>
        </div>
        <button class="action-btn primary-action create-account-btn">
          <i class="fas fa-check"></i> Создать счет
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.limit-reached {
  color: var(--danger-color);
  font-weight: 600;
}
</style>