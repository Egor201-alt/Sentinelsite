<script setup lang="ts">
import TheHeader from './components/TheHeader.vue';
import TheSidebar from './components/TheSidebar.vue';
import NewsFeed from './components/NewsFeed.vue';
import NewsSidebar from './components/NewsSidebar.vue';
</script>

<template>
  <div class="page-wrapper">
    <TheHeader />
    <div class="dashboard-body">
      <TheSidebar active-page="news" />
      <main class="main-content">
        <div class="news-layout">
          <NewsFeed />
          <NewsSidebar />
        </div>
      </main>
    </div>
  </div>
</template>