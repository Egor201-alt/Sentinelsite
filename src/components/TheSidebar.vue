<script setup lang="ts">

const props = defineProps<{
  activePage: string;
}>();

const navLinks = [
  { name: 'Профиль', href: 'profile.html', icon: 'fa-solid fa-user', key: 'profile' },
  { name: 'Новости', href: 'news.html', icon: 'fa-solid fa-newspaper', key: 'news' },
  { name: 'Банк', href: 'bank.html', icon: 'fa-solid fa-building-columns', key: 'bank' },
  { name: 'Игроки', href: 'players.html', icon: 'fa-solid fa-users', key: 'players' },
  { name: 'Города', href: 'cities.html', icon: 'fa-solid fa-map-location-dot', key: 'cities' },
  { name: 'Сервисы', href: 'services.html', icon: 'fa-solid fa-briefcase', key: 'services', isBeta: true },
  { name: 'Админ-панель', href: 'admin-panel.html', icon: 'fa-solid fa-hammer', key: 'admin-panel' },
  { name: 'О сайте', href: 'about.html', icon: 'fa-solid fa-circle-info', key: 'about' },
];

</script>

<template>
  <nav class="sidebar">
    <ul class="sidebar-nav">
      <li v-for="link in navLinks" :key="link.key">
        <a :href="link.href" :class="{ active: activePage === link.key }">
          <i :class="link.icon"></i> 
          {{ link.name }}
          <span v-if="link.isBeta" class="beta-badge">BETA</span>
        </a>
      </li>
    </ul>
  </nav>
</template>