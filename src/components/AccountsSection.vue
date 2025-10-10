<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';

const emit = defineEmits(['openModal']);

type FilterType = 'Все' | 'Карты' | 'Накопления';

const activeFilter = ref<FilterType>('Все');
const filters: FilterType[] = ['Все', 'Карты', 'Накопления'];

// --- Ссылки на HTML-элементы для анимации индикатора ---
const filterButtons = ref<HTMLElement[]>([]);
const activeIndicator = ref<HTMLElement | null>(null);

const allAccounts = ref([
  { id: 1, name: 'Карта жителя', number: '201670', balance: '823', type: 'card', bgClass: 'card-bg-1', link: 'bank_management.html' },
  { id: 2, name: 'Сигма сигма бой', number: '777666', balance: '125', type: 'card', bgClass: 'card-bg-2', link: 'bank_management.html' },
  { id: 3, name: 'Накопительный', number: '845123', balance: '1,450', type: 'savings', bgClass: 'card-bg-2', link: 'bank_management.html' },
]);

const filteredAccounts = computed(() => {
  if (activeFilter.value === 'Карты') {
    return allAccounts.value.filter(acc => acc.type === 'card');
  } 
  else if (activeFilter.value === 'Накопления') {
    return allAccounts.value.filter(acc => acc.type === 'savings');
  } 
  else {
    return allAccounts.value;
  }
});

// --- ЛОГИКА АНИМАЦИИ ИНДИКАТОРА ---

// Функция для перемещения индикатора под активную кнопку
function moveIndicator() {
  const activeBtn = filterButtons.value.find(btn => btn.textContent?.trim() === activeFilter.value);
  const indicator = activeIndicator.value;
  // Проверяем, что и кнопка, и индикатор существуют, и у кнопки есть родитель
  if (activeBtn && indicator && activeBtn.parentElement) {
    const targetRect = activeBtn.getBoundingClientRect();
    const containerRect = activeBtn.parentElement.getBoundingClientRect();
    indicator.style.width = `${targetRect.width}px`;
    indicator.style.transform = `translateX(${targetRect.left - containerRect.left}px)`;
  }
}

// "Следим" за изменениями переменной activeFilter.
// Как только она меняется, мы ждем следующего кадра (nextTick) и вызываем moveIndicator.
watch(activeFilter, async () => {
  await nextTick();
  moveIndicator();
});

// Вызываем moveIndicator один раз, когда компонент загрузился,
// чтобы индикатор сразу встал под кнопку "Все".
onMounted(() => {
  moveIndicator();
});

</script>

<template>
  <div class="accounts-section">
    <div class="accounts-header">
      <div class="transaction-filters">
        <!-- Добавляем сам элемент индикатора -->
        <span class="active-indicator" ref="activeIndicator"></span>
        <button 
          v-for="(filter, index) in filters" 
          :key="filter" 
          class="filter-btn" 
          :class="{ active: activeFilter === filter }"
          @click="activeFilter = filter"
          :ref="el => { if (el) filterButtons[index] = el as HTMLElement }"
        >
          {{ filter }}
        </button>
      </div>
      <button class="action-btn primary-action small-btn" @click="emit('openModal')">
        <i class="fas fa-plus"></i> Открыть счет
      </button>
    </div>
    <div class="accounts-list">
      <a v-for="account in filteredAccounts" :key="account.id" :href="account.link" class="account-card" :class="account.bgClass">
        <div class="account-card-info glass-container">
          <span class="account-name">{{ account.name }}</span>
          <span class="account-number">{{ account.number }}</span>
        </div>
        <div class="account-card-balance">
          <span>{{ account.balance }}</span>
          <span class="currency-symbol">АР</span>
        </div>
      </a>
    </div>
  </div>
</template>