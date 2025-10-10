<script setup lang="ts">
import { ref } from 'vue';
import TheHeader from './components/TheHeader.vue';
import TheSidebar from './components/TheSidebar.vue';
import ProfileHeader from './components/ProfileHeader.vue';
import ProfilePosts from './components/ProfilePosts.vue';
import ProfileAccounts from './components/ProfileAccounts.vue';

// В будущем эти данные будут приходить с сервера для конкретного игрока
const playerData = ref({
    nickname: 'Egor201',
    role: { name: 'Игрок', icon: 'fas fa-user' },
    joinDate: 'На сервере с 17.09.2025',
    stats: {
        balance: '1,500 АР',
        playtime: '115 ч.',
        lastSeen: 'Сегодня, 18:48',
        likes: 37
    },
    posts: [
      { id: 1, date: '24.07.2025, 23:13', content: 'Бла бла бла **бле бле бле**\n\n- блю блю блю', likes: 12, dislikes: 1 },
      { id: 2, date: '25.07.2025, 10:45', content: 'Тест жопы показал 2 полоски...', likes: 25, dislikes: 0 },
    ],
    accounts: [
      { id: 1, name: 'Карта жителя', number: '201670', balance: '823', bgClass: 'card-bg-1'},
      { id: 2, name: 'Сигма сигма бой', number: '777666', balance: '125', bgClass: 'card-bg-2'},
      { id: 3, name: 'Накопительный', number: '845123', balance: '1,450', bgClass: 'card-bg-2'},
    ]
});
</script>

<template>
  <div class="page-wrapper">
    <TheHeader />
    <div class="dashboard-body">
      <TheSidebar active-page="profile" />
      <main class="main-content">
        <ProfileHeader :player="playerData" />
        <div class="profile-content-grid">
          <ProfilePosts :posts="playerData.posts" :author="playerData.nickname" />
          <ProfileAccounts :accounts="playerData.accounts" />
        </div>
      </main>
    </div>
  </div>
</template>