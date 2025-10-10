<script setup lang="ts">
import { ref, onMounted } from 'vue';

const cardName = ref('Карта жителя');
const cardNumber = ref('201670');
const balance = ref(0);
const finalBalance = 823;
const isCardActive = ref(false);

const shareButtonRef = ref<HTMLButtonElement | null>(null);
const cardDisplayRef = ref<HTMLElement | null>(null);

const emit = defineEmits(['openModal']);

function animateBalance() {
  let startTimestamp: number | null = null;
  const duration = 1500;
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    balance.value = Math.floor(progress * finalBalance);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      balance.value = finalBalance;
    }
  };
  window.requestAnimationFrame(step);
}

function shareCardDetails() {
  const playerNickname = "Egor201";
  const textToCopy = `Реквизиты для перевода:\n- Ник: ${playerNickname}\n- Счет: ${cardName.value}\n- Номер: ${cardNumber.value}`.trim();
  navigator.clipboard.writeText(textToCopy).then(() => {
    const shareBtn = shareButtonRef.value;
    if (!shareBtn) return;
    const originalIcon = shareBtn.innerHTML;
    shareBtn.innerHTML = '<i class="fas fa-check"></i>';
    shareBtn.classList.add('copied');
    setTimeout(() => {
      shareBtn.innerHTML = originalIcon;
      shareBtn.classList.remove('copied');
    }, 1500);
  }).catch(err => {
    console.error('Не удалось скопировать текст: ', err);
    alert('Ошибка при копировании реквизитов.');
  });
}

function handleCardMouseMove(e: MouseEvent) {
    if (!isCardActive.value || !cardDisplayRef.value) return;
    const card = cardDisplayRef.value;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    card.style.transform = `translateY(-10px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function activateCard() {
    isCardActive.value = true;
    if (cardDisplayRef.value) {
        cardDisplayRef.value.style.transform = 'translateY(-10px) scale(1.1)';
    }
}

function deactivateCard() {
    isCardActive.value = false;
    if (cardDisplayRef.value) {
        cardDisplayRef.value.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
    }
}

onMounted(() => {
  animateBalance();
});
</script>

<template>
  <aside class="account-panel">
    <div class="card-display-wrapper">
      <div 
        class="card-display" 
        ref="cardDisplayRef" 
        :class="{ 'card-active': isCardActive }"
        @click="activateCard" 
        @mousemove="handleCardMouseMove" 
        @mouseleave="deactivateCard"
      >
        <div class="card-info glass-container">
          <div class="card-name-wrapper">
            <span class="card-name">{{ cardName }}</span>
            <div class="card-controls">
              <button class="card-icon-btn" @click.stop="emit('openModal', 'edit-name')" title="Изменить название"><i class="fa-solid fa-pencil"></i></button>
              <button class="card-icon-btn" ref="shareButtonRef" @click.stop="shareCardDetails" title="Поделиться реквизитами"><i class="fa-solid fa-copy"></i></button>
            </div>
          </div>
          <span class="card-number">{{ cardNumber }}</span>
        </div>
        <div class="card-balance">
          <span>{{ balance }}</span><span class="currency-symbol">АР</span>
        </div>
      </div>
    </div>
    <div class="action-buttons">
      <button class="action-btn primary-action" @click="emit('openModal', 'transfer')"><i class="fas fa-paper-plane"></i> Новый перевод</button>
      <button class="action-btn primary-action" @click="emit('openModal', 'payment')"><i class="fas fa-wallet"></i> Новый платеж</button>
      <button class="action-btn" @click="emit('openModal', 'design')"><i class="fas fa-palette"></i> Изменить дизайн</button>
      <button class="action-btn" @click="emit('openModal', 'autopay')"><i class="fas fa-sync-alt"></i> Автоплатежи</button>
      <button class="action-btn" @click="emit('openModal', 'limits')"><i class="fas fa-sliders-h"></i> Управление лимитом</button>
    </div>
    <div class="danger-zone">
      <div class="danger-zone-title">ОПАСНАЯ ЗОНА</div>
      <div class="danger-buttons">
        <button class="action-btn danger" @click="emit('openModal', 'danger-block')"><i class="fas fa-lock"></i> Заблокировать</button>
        <button class="action-btn danger" @click="emit('openModal', 'danger-delete')"><i class="fas fa-trash-alt"></i> Удалить счет</button>
      </div>
    </div>
  </aside>
</template>