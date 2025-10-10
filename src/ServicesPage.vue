<script setup lang="ts">
import TheHeader from './components/TheHeader.vue';
import TheSidebar from './components/TheSidebar.vue';
import SpotlightSection from './components/SpotlightSection.vue';
import ServicesList from './components/ServicesList.vue';
</script>

<template>
  <div class="page-wrapper">
    <TheHeader />
    <div class="dashboard-body">
      <TheSidebar active-page="services" />
      <main class="main-content">
        <SpotlightSection />
        <ServicesList />
      </main>
    </div>
  </div>
</template>