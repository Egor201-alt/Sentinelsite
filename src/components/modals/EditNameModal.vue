<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{ isVisible: boolean }>();
const emit = defineEmits(['close']);

const newName = ref('');

const charCounterText = computed(() => {
  const maxLength = 21;
  return `${newName.value.length}/${maxLength}`;
});

const isLimitReached = computed(() => {
  return newName.value.length >= 21;
});

function saveName() {
  if (newName.value.trim().length === 0) {
    alert('Название не может быть пустым!');
    return;
  }
  
  console.log('Сохраняем новое имя:', newName.value);
  alert(`Название успешно изменено на "${newName.value}"!`);
  
  emit('close');
}

watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    newName.value = '';
  }
});

</script>

<template>
  <div class="modal-overlay" :class="{ 'visible': isVisible }" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <header class="modal-header">
        <h2>Изменить название счета</h2>
        <button class="close-modal-btn" @click="emit('close')"><i class="fas fa-times"></i></button>
      </header>
      <div class="modal-body">
        <div class="form-group">
          <label for="new-card-name">Новое название</label>
          <div class="input-with-counter">
            <input 
              type="text" 
              id="new-card-name" 
              class="styled-input" 
              placeholder="Введите новое название" 
              maxlength="21"
              v-model="newName"
            >
            <span class="char-counter" :class="{ 'limit-reached': isLimitReached }">
              {{ charCounterText }}
            </span>
          </div>
        </div>

        <div class="important-notice">
          <i class="fas fa-info-circle"></i>
          <p><strong>Внимание:</strong> Изменить название счета можно будет снова только через <strong>7 дней</strong>.</p>
        </div>
        <button class="action-btn primary-action save-name-btn" @click="saveName">
          <i class="fas fa-save"></i> Сохранить
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-with-counter {
  position: relative;
  width: 100%;
}

.char-counter {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 500;
  transition: color 0.2s ease;
  pointer-events: none; 
}

.char-counter.limit-reached {
  color: var(--danger-color);
  font-weight: 600;
}
</style>