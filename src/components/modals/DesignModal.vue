<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ isVisible: boolean }>();
const emit = defineEmits(['close']);

// --- СОСТОЯНИЕ КОМПОНЕНТА ---

const activeDesignId = ref('standard');

const designs = [
  { id: 'standard', name: 'Стандартный', price: 0, image: 'http://localhost:5173/img/maxresdefault1.jpg', isLocked: false },
  { id: 'design2', name: 'Неизвестно', price: 15, isLocked: true },
  { id: 'design3', name: 'Неизвестно', price: 15, isLocked: true },
  { id: 'design4', name: 'Неизвестно', price: 15, isLocked: true },
  { id: 'design5', name: 'Неизвестно', price: 25, isLocked: true },
  { id: 'design6', name: 'Неизвестно', price: 50, isLocked: true },
];

// --- МЕТОДЫ (функции) ---

function selectDesign(design: { id: string, isLocked: boolean, price: number }) {
  if (design.isLocked) {
    console.log(`Дизайн ${design.id} заблокирован. Цена: ${design.price} АР`);
    return; 
  }
  activeDesignId.value = design.id;
}
</script>

<template>
  <div class="modal-overlay" :class="{ 'visible': isVisible }" @click="emit('close')">
    <div id="design-modal" class="modal-content" @click.stop>
      <header class="modal-header">
        <h2>Изменить дизайн карты</h2>
        <button class="close-modal-btn" @click="emit('close')"><i class="fas fa-times"></i></button>
      </header>
      <div class="modal-body">
        <p>Выберите один из доступных дизайнов для вашей карты.</p>
        <div class="design-gallery">
          
          <div 
            v-for="design in designs" 
            :key="design.id"
            class="design-card"
            :class="{ active: activeDesignId === design.id, locked: design.isLocked }"
            @click="selectDesign(design)"
          >
            <img v-if="design.image" :src="design.image" :alt="design.name">
            <div v-else class="design-card-placeholder"></div>
            
            <div v-if="design.isLocked" class="design-card-locked-overlay">
              <i class="fas fa-lock"></i>
              <span class="design-price">{{ design.price }} АР</span>
            </div>

            <div class="design-card-overlay">
              <i v-if="activeDesignId === design.id" class="fas fa-check-circle"></i>
              <span>{{ design.name }}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal-content {
    max-width: 700px;
}
</style>