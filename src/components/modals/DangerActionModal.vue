<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ 
  isVisible: boolean,
  type: string | null 
}>();

const emit = defineEmits(['close']);

// Создаем "вычисляемые" переменные для текста.
// Они будут автоматически меняться в зависимости от того, какой 'type' пришел.
const title = computed(() => {
  if (props.type === 'danger-block') return 'Заблокировать счет?';
  if (props.type === 'danger-delete') return 'Удалить счет?';
  return 'Подтвердите действие';
});

const text = computed(() => {
  if (props.type === 'danger-block') return 'Вы уверены, что хотите заблокировать этот счет? Вы не сможете совершать по нему никаких операций.';
  if (props.type === 'danger-delete') return 'Вы уверены, что хотите НАВСЕГДА удалить этот счет? Все средства будут утеряны, а действие необратимо.';
  return 'Вы уверены, что хотите выполнить это действие?';
});

const confirmButtonText = computed(() => {
  if (props.type === 'danger-block') return 'Заблокировать';
  if (props.type === 'danger-delete') return 'Удалить';
  return 'Подтвердить';
});

// Переменная, которая показывает блок с предупреждением ТОЛЬКО для блокировки
const showBlockNotice = computed(() => props.type === 'danger-block');
</script>

<template>
  <div class="modal-overlay" :class="{ 'visible': isVisible }" @click="emit('close')">
    <div class="modal-content danger-modal" @click.stop>
      <div class="danger-modal-wrapper">
        <div class="danger-modal-icon"><i class="fas fa-exclamation-triangle"></i></div>
        
        <h2 class="danger-modal-title">{{ title }}</h2>
        <p class="danger-modal-text">{{ text }}</p>
        
        <!-- Вот то самое предупреждение, которое будет показано только при блокировке -->
        <div v-if="showBlockNotice" class="important-notice">
            <i class="fas fa-exclamation-triangle"></i>
            <p><strong>Важно:</strong> Разблокировать счет можно будет только в отделении банка в течение 21 дня. После этого счет будет выставлен на аукцион.</p>
        </div>

        <div class="danger-modal-actions">
          <button class="action-btn confirm-btn">{{ confirmButtonText }}</button>
          <button class="action-btn cancel-btn" @click="emit('close')">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>