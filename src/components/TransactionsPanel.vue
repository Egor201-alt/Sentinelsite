<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';

const emit = defineEmits(['openModal']);

// --- 1. СОСТОЯНИЕ КОМПОНЕНТА ---

// ИСПРАВЛЕНИЕ: Структура данных теперь ПОЛНОСТЬЮ ЕДИНООБРАЗНА.
// У КАЖДОЙ транзакции в details есть объект status с полями text, class и icon.
// Также добавлены все возможные поля (seller, source и т.д.) со значением null, чтобы TypeScript был спокоен.
const allTransactions = ref([
  { id: 1, type: 'purchase', title: 'Покупка в ТЦ "Красный Помидор"', date: '13.09.2025, 12:31', amount: -192, details: { opId: '#C2D4-EFG2', seller: 'AcouscticBlurryLowTAB', source: null, reason: null, purpose: null, status: { text: 'Обрабатывается', class: 'status-pending', icon: 'fa-hourglass-half' } } },
  { id: 2, type: 'deposit', title: 'Пополнение', date: '13.09.2025, 19:47', amount: 250, details: { opId: '#A4B8-XYZ1', seller: null, source: 'Центральный Банк', reason: null, purpose: null, status: { text: 'Выполнено', class: 'status-completed', icon: 'fa-check-circle' } } },
  { id: 3, type: 'transfer', title: 'Перевод игроку opl67', date: '13.09.2025, 09:18', amount: -50, details: { opId: '#H5J7-KLM3', seller: null, source: null, reason: 'Недостаточно средств', purpose: null, status: { text: 'Отменено', class: 'status-cancelled', icon: 'fa-times-circle' } } },
  { id: 4, type: 'fine', title: 'Оплата штрафа от Sentinel AI', date: '12.09.2025, 18:34', amount: -150, details: { opId: '#N8P9-QRS4', seller: null, source: null, reason: 'Нарушение правил', purpose: null, status: { text: 'Выполнено', class: 'status-completed', icon: 'fa-check-circle' } } },
  { id: 5, type: 'tax', title: 'Оплата налога города "Syspencion"', date: '12.09.2025, 11:12', amount: -12, details: { opId: '#T1U2-VWX5', seller: null, source: null, reason: null, purpose: 'Еженедельный налог', status: { text: 'Выполнено', class: 'status-completed', icon: 'fa-check-circle' } } },
  { id: 6, type: 'deposit', title: 'Пополнение', date: '13.09.2025, 19:47', amount: 200, details: { opId: '#BFB8-YUZ9', seller: null, source: 'Центральный Банк', reason: null, purpose: null, status: { text: 'Выполнено', class: 'status-completed', icon: 'fa-check-circle' } } },
]);

const activeFilter = ref('Все');
const expandedTransactionId = ref<number | null>(null);
const filters = ['Все', 'Пополнения', 'Списания'];
const filterButtons = ref<HTMLElement[]>([]);
const activeIndicator = ref<HTMLElement | null>(null);

// --- 2. ВЫЧИСЛЯЕМЫЕ СВОЙСТВА ---
const filteredTransactions = computed(() => {
  switch (activeFilter.value) {
    case 'Пополнения':
      return allTransactions.value.filter(tx => tx.amount > 0);
    case 'Списания':
      return allTransactions.value.filter(tx => tx.amount < 0);
    case 'Все':
    default:
      return allTransactions.value;
  }
});

// --- 3. МЕТОДЫ (ФУНКЦИИ) ---
function selectFilter(filterName: string) {
  activeFilter.value = filterName;
}

function toggleTransaction(transactionId: number) {
  expandedTransactionId.value = expandedTransactionId.value === transactionId ? null : transactionId;
}

function moveIndicator() {
  const activeBtn = filterButtons.value.find(btn => btn.textContent?.trim() === activeFilter.value);
  const indicator = activeIndicator.value;
  if (activeBtn && indicator && activeBtn.parentElement) {
    const targetRect = activeBtn.getBoundingClientRect();
    const containerRect = activeBtn.parentElement.getBoundingClientRect();
    indicator.style.width = `${targetRect.width}px`;
    indicator.style.transform = `translateX(${targetRect.left - containerRect.left}px)`;
  }
}

watch(activeFilter, async () => {
  await nextTick();
  moveIndicator();
});

onMounted(() => {
  moveIndicator();
});
</script>

<template>
  <section class="transactions-panel">
    <div class="panel-header">
      <h2>Последние операции</h2>
      <div class="transaction-filters">
        <span class="active-indicator" ref="activeIndicator"></span>
        <button
          v-for="(filter, index) in filters"
          :key="filter"
          class="filter-btn"
          :class="{ active: activeFilter === filter }"
          @click="selectFilter(filter)"
          :ref="el => { if (el) filterButtons[index] = el as HTMLElement }"
        >
          {{ filter }}
        </button>
      </div>
      <button class="icon-btn" @click="emit('openModal', 'analytics')" title="Анализ расходов"><i class="fas fa-chart-pie"></i></button>
    </div>
    
    <ul v-if="filteredTransactions.length > 0" class="transaction-list">
      <li 
        v-for="tx in filteredTransactions" 
        :key="tx.id" 
        class="transaction-item"
        :class="{ expanded: expandedTransactionId === tx.id }"
        @click="toggleTransaction(tx.id)"
      >
        <div class="transaction-summary">
          <div class="transaction-main-info">
            <div 
              class="transaction-icon-wrapper" 
              :class="[
                tx.amount > 0 ? 'icon-positive' : 'icon-negative', 
                { 'icon-transfer': tx.type === 'transfer', 'icon-neutral': tx.type === 'tax' }
              ]"
            >
              <i 
                class="fas" 
                :class="{
                  'fa-shopping-cart': tx.type === 'purchase', 
                  'fa-piggy-bank': tx.type === 'deposit', 
                  'fa-paper-plane': tx.type === 'transfer', 
                  'fa-gavel': tx.type === 'fine', 
                  'fa-landmark': tx.type === 'tax' 
                }"
              ></i>
            </div>
            <div class="transaction-details">
              <span class="transaction-title">{{ tx.title }}</span>
              <span class="transaction-date">{{ tx.date }}</span>
            </div>
          </div>
          <div class="transaction-amount" :class="{ 'positive': tx.amount > 0, 'negative': tx.amount < 0 }">
            {{ tx.amount > 0 ? '+' : '' }}{{ tx.amount }} <span class="currency-symbol">АР</span>
          </div>
        </div>
        <div class="transaction-expanded-details">
          <div class="detail-row"><span>Номер операции:</span><strong>{{ tx.details.opId }}</strong></div>
          <div v-if="tx.details.seller" class="detail-row"><span>Продавец:</span><strong>{{ tx.details.seller }}</strong></div>
          <div v-if="tx.details.source" class="detail-row"><span>Источник:</span><strong>{{ tx.details.source }}</strong></div>
          <div v-if="tx.details.reason" class="detail-row"><span>Причина:</span><strong>{{ tx.details.reason }}</strong></div>
          <div v-if="tx.details.purpose" class="detail-row"><span>Назначение:</span><strong>{{ tx.details.purpose }}</strong></div>
          <div class="detail-row"><span>Статус:</span><strong :class="tx.details.status.class"><i class="fas" :class="tx.details.status.icon"></i> {{ tx.details.status.text }}</strong></div>
        </div>
      </li>
    </ul>

    <div v-else class="no-results-message">
      <i class="fas fa-search"></i>
      <span>Операции по данному фильтру не найдены.</span>
    </div>
    
    <div class="pagination">
      <button class="page-btn" disabled><i class="fas fa-chevron-left"></i></button>
      <span>Страница 1</span>
      <button class="page-btn"><i class="fas fa-chevron-right"></i></button>
    </div>
  </section>
</template>

<style scoped>
/* Стили для сообщения об отсутствии результатов */
.no-results-message {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  color: var(--text-muted);
  text-align: center;
  font-size: 1rem;
  min-height: 200px; /* Чтобы контейнер не схлопывался */
}
.no-results-message i {
  font-size: 2.5rem;
}

/* Добавляем плавность для появления/исчезновения списка */
.transaction-list {
  transition: opacity 0.3s ease;
}
</style>