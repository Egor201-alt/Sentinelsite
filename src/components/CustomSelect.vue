<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

type Option = {
  value: string;
  text: string;
  icon: string;
};

const props = defineProps<{
  label: string;
  options: Option[];
  modelValue: string;
  type?: 'players' | 'news';
}>();

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);

const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue) ?? props.options[0];
});

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function selectOption(option: Option) {
  emit('update:modelValue', option.value);
  isOpen.value = false;
}

const selectElement = ref<HTMLElement | null>(null);
const handleClickOutside = (event: MouseEvent) => {
  if (selectElement.value && !selectElement.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<template>
  <!-- Верстка для страницы Игроков -->
  <div v-if="type === 'players'" class="role-select-wrapper" ref="selectElement" :class="{ open: isOpen }">
    <label>{{ label }}</label>
    <div class="custom-select-trigger" @click="toggleDropdown">
      <span class="selected-option-text">
        <i :class="selectedOption.icon"></i> {{ selectedOption.text }}
      </span>
      <i class="fas fa-chevron-down arrow"></i>
    </div>
    <div class="custom-options" :class="{ hidden: !isOpen }">
      <div 
        v-for="option in options" 
        :key="option.value" 
        class="custom-option"
        :class="{ selected: modelValue === option.value }"
        @click="selectOption(option)"
      >
        <i :class="option.icon"></i> {{ option.text }}
      </div>
    </div>
  </div>

  <!-- Верстка для страницы Новостей -->
  <div v-else class="filter-group" ref="selectElement" :class="{ active: isOpen }">
    <label>{{ label }}</label>
    <div class="styled-select" @click="toggleDropdown">
      <i class="selected-icon" :class="selectedOption.icon"></i>
      <span>{{ selectedOption.text }}</span>
      <i class="fas fa-chevron-down dropdown-arrow"></i>
    </div>
    <ul class="dropdown-menu" v-if="isOpen">
      <li 
        v-for="option in options" 
        :key="option.value"
        @click="selectOption(option)"
        :class="{ selected: modelValue === option.value }"
      >
        <i :class="option.icon"></i> {{ option.text }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Добавляем стили для подсветки. 
   Они будут работать для обоих вариантов селекта.
   !important используется, чтобы перебить другие стили, если они мешают. */
.custom-option.selected,
.dropdown-menu li.selected {
  background-color: var(--primary-color) !important;
  color: var(--bg-color) !important;
  font-weight: 600;
}
.custom-option.selected i,
.dropdown-menu li.selected i {
  color: var(--bg-color) !important;
}
</style>