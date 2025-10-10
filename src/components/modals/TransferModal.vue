<script setup lang="ts">
defineProps<{ isVisible: boolean }>();
const emit = defineEmits(['close']);
</script>

<template>
  <!-- 
    ИЗМЕНЕНИЕ №1: Вместо v-if="isVisible" мы используем :class.
    Элемент теперь ВСЕГДА будет в HTML, но будет видим только
    когда isVisible === true, благодаря классу 'visible'.
  -->
  <div 
    class="modal-overlay" 
    :class="{ 'visible': isVisible }"
    @click="emit('close')"
  >
    <div class="modal-content" @click.stop>
      <header class="modal-header">
        <h2>Новый перевод</h2>
        <button class="close-modal-btn" @click="emit('close')"><i class="fas fa-times"></i></button>
      </header>
      <div class="modal-body">
        <p>Выберите способ, которым вы хотите совершить перевод.</p>
        <div class="transfer-options">
          <button class="transfer-option">
            <i class="fas fa-user"></i>
            <div class="transfer-option-text">
              <span>Перевод по нику</span>
              <small>Отправить другому игроку</small>
            </div>
            <div class="commission-badge"><span>5%</span><small>комиссия</small></div>
          </button>
          <button class="transfer-option">
            <i class="fas fa-hashtag"></i>
            <div class="transfer-option-text">
              <span>Перевод по номеру</span>
              <small>Перевести по номеру счета</small>
            </div>
            <div class="commission-badge commission-high"><span>8%</span><small>комиссия</small></div>
          </button>
          <button class="transfer-option">
            <i class="fas fa-exchange-alt"></i>
            <div class="transfer-option-text">
              <span>Между счетами</span>
              <small>Переместить на свой другой счет</small>
            </div>
            <div class="commission-badge commission-free"><span>0%</span><small>Без комиссии</small></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>