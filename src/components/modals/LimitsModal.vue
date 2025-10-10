<script setup lang="ts">
import { ref, computed, watch } from 'vue';

defineProps<{ isVisible: boolean }>();
const emit = defineEmits(['close']);

// --- СОСТОЯНИЕ КОМПОНЕНТА ---
const sliderValue = ref(1010); // Начальное значение лимита, например, максимальное
const sliderMin = 100;
const sliderMax = 1010; // Максимальное значение + шаг, чтобы поймать "Без лимита"

// --- ВЫЧИСЛЯЕМЫЕ СВОЙСТВА (computed) ---
// Это "умные" переменные, которые автоматически пересчитываются, когда меняется sliderValue.

// 1. Определяем, достигнут ли максимальный лимит
const isNoLimit = computed(() => sliderValue.value >= sliderMax);

// 2. Форматируем текст для отображения: либо число, либо "Без лимита"
const limitDisplayText = computed(() => {
  return isNoLimit.value ? 'Без лимита' : sliderValue.value;
});

// 3. Динамически создаем стиль для градиентной заливки слайдера
const sliderBackgroundStyle = computed(() => {
  const percentage = ((sliderValue.value - sliderMin) * 100) / (sliderMax - sliderMin);
  return `linear-gradient(to right, var(--primary-color) ${percentage}%, #333 ${percentage}%)`;
});

// --- МЕТОДЫ (функции) ---
function saveLimits() {
  const valueToSave = isNoLimit.value ? 'Безлимитный' : `${sliderValue.value} АР`;
  console.log('Сохраняем новый лимит:', valueToSave);
  alert(`Лимит успешно изменен на: ${valueToSave}`);
  emit('close');
}
</script>

<template>
  <div class="modal-overlay" :class="{ 'visible': isVisible }" @click="emit('close')">
    <div class="modal-content" @click.stop>
      <header class="modal-header">
        <h2>Управление лимитами</h2>
        <button class="close-modal-btn" @click="emit('close')"><i class="fas fa-times"></i></button>
      </header>
      <div class="modal-body">
        <div class="limit-setter">
          <label for="limit-slider">Лимит на покупки в месяц</label>
          
          <!-- Контейнеру добавляется класс 'no-limit', если выбран максимум -->
          <div class="limit-display" :class="{ 'no-limit': isNoLimit }">
            <span>{{ limitDisplayText }}</span>
            <!-- Символ "АР" будет показан только если это не безлимит -->
            <span v-if="!isNoLimit" class="currency-symbol">АР</span>
          </div>
          
          <!-- 
            Связываем слайдер с нашей переменной sliderValue через v-model.
            Динамически применяем стиль для фона.
          -->
          <input 
            type="range" 
            :min="sliderMin" 
            :max="sliderMax" 
            step="10" 
            class="limit-slider" 
            v-model.number="sliderValue"
            :style="{ background: sliderBackgroundStyle }"
          >
        </div>

        <div class="important-notice">
          <i class="fas fa-exclamation-triangle"></i>
          <p><strong>Внимание:</strong> Установленный лимит можно будет изменить или снять только при личном обращении в отделение банка.</p>
        </div>

        <button class="action-btn primary-action save-limit-btn" @click="saveLimits">
          Сохранить изменения
        </button>
      </div>
    </div>
  </div>
</template>