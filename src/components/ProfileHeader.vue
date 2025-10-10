<script setup lang="ts">
defineProps<{
  player: {
    nickname: string;
    role: { name: string; icon: string; };
    joinDate: string;
    stats: { balance: string; playtime: string; lastSeen: string; likes: number; };
  }
}>();
</script>

<template>
  <div class="profile-header-card">
    <div class="profile-avatar">
      <img :src="`https://vzge.me/head/512/${player.nickname}.png?y=70`" :alt="`Аватар ${player.nickname}`">
    </div>
    <div class="profile-info">
      <div class="profile-main-info">
        <h1 class="profile-nickname">{{ player.nickname }}</h1>
        <div class="profile-role">
          <i :class="player.role.icon"></i>
          <span>{{ player.role.name }}</span>
        </div>
      </div>
      <span class="profile-join-date">{{ player.joinDate }}</span>
      <div class="profile-stats">
        <div class="stat-item"><i class="fas fa-wallet"></i><span>{{ player.stats.balance }}</span><small>Общий баланс</small></div>
        <div class="stat-item"><i class="fas fa-hourglass-half"></i><span>{{ player.stats.playtime }}</span><small>Наиграно</small></div>
        <div class="stat-item"><i class="fas fa-clock"></i><span>{{ player.stats.lastSeen }}</span><small>Последний вход</small></div>
        <div class="stat-item"><i class="fas fa-thumbs-up"></i><span>{{ player.stats.likes }}</span><small>Всего лайков</small></div>
      </div>
    </div>
  </div>
</template>