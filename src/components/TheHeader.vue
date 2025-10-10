<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isDropdownOpen = ref(false);

const closeDropdown = () => {
  isDropdownOpen.value = false;
};

onMounted(() => window.addEventListener('click', closeDropdown));
onUnmounted(() => window.removeEventListener('click', closeDropdown));
</script>

<template>
  <header class="site-header">
    <!-- ЗАМЕНА: Вместо h2.site-title теперь используется a.logo -->
    <a href="/" class="logo">
      <img src="/assets/icon_sentinel.png" alt="Логотип Sentinel">
      <span>Sentinel</span>
    </a>

    <div class="header-right-panel">
      <button class="header-icon-btn" id="notifications-btn">
        <i class="fas fa-bell"></i>
      </button>
      <div class="header-profile" @click.stop="isDropdownOpen = !isDropdownOpen">
        <span class="profile-name">Egor201</span>
        <img src="https://visage.surgeplay.com/face/64/Egor201.png" alt="Аватар игрока Egor201">
      </div>
    </div>
    <div class="profile-dropdown" :class="{ hidden: !isDropdownOpen }" @click.stop>
      <div class="dropdown-user-info">
        <img src="https://visage.surgeplay.com/face/64/Egor201.png" alt="Аватар Egor201">
        <div class="user-info-text">
          <span class="user-info-name">Egor201</span>
        </div>
      </div>
      <hr class="dropdown-divider">
      <nav class="dropdown-menu">
        <a href="#" class="dropdown-item"><i class="fas fa-cog"></i><span>Настройки</span></a>
        <a href="#" class="dropdown-item danger-link"><i class="fas fa-sign-out-alt"></i><span>Выйти</span></a>
      </nav>
    </div>
  </header>
</template>