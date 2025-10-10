<script setup lang="ts">
import { ref, computed } from 'vue';

type ServiceType = 'gov' | 'player';
type Tag = { text: string; class: string };

type Service = {
  id: number;
  type: ServiceType;
  title: string;
  author: string;
  description: string;
  tags: Tag[];
  themeClass: string;
};

// В будущем эти данные будут приходить с сервера
const allServices = ref<Service[]>([
  { id: 1, type: 'gov', title: 'Суд', author: 'Sentinel', description: 'Проверка статуса судебных дел по уникальному коду.', tags: [{text: 'Государственное', class: 'tag-gov'}], themeClass: 'gov' },
  { id: 2, type: 'player', title: 'Казино "Удача"', author: 'chaynik1337', description: 'Испытай свою удачу в рулетке и блекджеке на АРы!', tags: [{text: 'От игрока', class: 'tag-player'}, {text: 'Азартные игры', class: 'tag-games'}], themeClass: 'casino' },
  { id: 3, type: 'gov', title: 'Вызовы', author: 'Sentinel', description: 'Экстренный вызов гвардейца или банкира на ваши координаты.', tags: [{text: 'Государственное', class: 'tag-gov'}, {text: 'Безопасность', class: 'tag-security'}], themeClass: 'gov' },
  { id: 4, type: 'player', title: 'Коробочки', author: 'Egor201', description: 'Маркетплейс, быстрая доставка любых товаров!', tags: [{text: 'От игрока', class: 'tag-player'}, {text: 'Утилиты', class: 'tag-utility'}], themeClass: 'delivery' },
]);

const activeFilter = ref('Все'); // 'Все' | 'Государственные' | 'От игроков'

const filteredServices = computed(() => {
  switch (activeFilter.value) {
    case 'Государственные':
      return allServices.value.filter(service => service.type === 'gov');
    case 'От игроков':
      return allServices.value.filter(service => service.type === 'player');
    default:
      return allServices.value;
  }
});

</script>

<template>
  <section class="services-section">
    <div class="filter-tabs">
      <button class="filter-tab" :class="{ active: activeFilter === 'Все' }" @click="activeFilter = 'Все'">Все</button>
      <button class="filter-tab" :class="{ active: activeFilter === 'Государственные' }" @click="activeFilter = 'Государственные'">Государственные</button>
      <button class="filter-tab" :class="{ active: activeFilter === 'От игроков' }" @click="activeFilter = 'От игроков'">От игроков</button>
    </div>

    <div class="services-grid">
      <div v-for="service in filteredServices" :key="service.id" class="service-card" :class="service.themeClass">
        <div class="service-header">
          <div class="header-text">
            <h3 class="service-title">{{ service.title }}</h3>
            <span class="service-author">от {{ service.author }}</span>
          </div>
        </div>
        <div class="service-content">
          <div class="divider"></div>
          <p class="service-desc">{{ service.description }}</p>
          <div class="service-tags">
            <span v-for="tag in service.tags" :key="tag.text" class="tag" :class="tag.class">{{ tag.text }}</span>
          </div>
          <button class="action-btn primary-action launch-btn">Запустить</button>
        </div>
      </div>
    </div>
  </section>
</template>