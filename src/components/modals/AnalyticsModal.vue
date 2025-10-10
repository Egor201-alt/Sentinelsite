<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ isVisible: boolean }>();
const emit = defineEmits(['close']);

// --- СОСТОЯНИЕ КОМПОНЕНТА ---

// 1. Создаем переменную, которая будет хранить ключ подсвеченной категории
const highlightedCategory = ref<string | null>(null);

// 2. Выносим данные для легенды в массив объектов.
//    Это делает код чище и позволяет легко добавлять новые категории в будущем.
const legendData = [
  { label: 'Переводы', amount: '450 АР', colorClass: 'color-transfers', highlightKey: 'transfers' },
  { label: 'Покупки', amount: '320 АР', colorClass: 'color-purchases', highlightKey: 'purchases' },
  { label: 'Штрафы', amount: '150 АР', colorClass: 'color-fines', highlightKey: 'fines' },
  { label: 'Налоги', amount: '80 АР', colorClass: 'color-taxes', highlightKey: 'taxes' },
];
</script>

<template>
  <div class="analytics-modal" :class="{ 'modal-visible': isVisible }" @click="emit('close')">
    <div class="analytics-content" @click.stop>
      <header class="analytics-header">
        <h2>Анализ расходов</h2>
        <button class="close-modal-btn" @click="emit('close')"><i class="fas fa-times"></i></button>
      </header>
      <div class="analytics-body">
        <div class="chart-container">
          <!-- 
            3. ДИНАМИЧЕСКИЙ КЛАСС ДЛЯ ПОДСВЕТКИ
            Этот класс будет добавляться к диаграмме, только если highlightedCategory не пустая.
            Например, если highlightedCategory = 'transfers', сюда добавится класс 'highlight-transfers'.
          -->
          <div 
            class="analytics-chart" 
            :class="{ ['highlight-' + highlightedCategory]: highlightedCategory }"
          ></div>
        </div>
        <ul class="analytics-legend">
          <!-- 
            4. ДИНАМИЧЕСКИЙ РЕНДЕРИНГ ЛЕГЕНДЫ
            Мы используем цикл v-for, чтобы создать элемент <li> для каждого объекта в нашем массиве legendData.
          -->
          <li 
            v-for="item in legendData" 
            :key="item.label" 
            class="legend-item"
            @mouseenter="highlightedCategory = item.highlightKey"
            @mouseleave="highlightedCategory = null"
          >
            <span class="legend-color" :class="item.colorClass"></span>
            <span class="legend-label">{{ item.label }}</span>
            <span class="legend-amount">{{ item.amount }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>