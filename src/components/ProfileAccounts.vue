<script setup lang="ts">
type Account = {
  id: number;
  name: string;
  number: string;
  balance: string;
  bgClass: string;
};

defineProps<{
  accounts: Account[];
}>();
</script>

<template>
  <div class="profile-accounts-section">
    <h2>Счета игрока</h2>
    <div class="accounts-list-profile">
      <a v-for="account in accounts" :key="account.id" href="#" class="account-card" :class="account.bgClass">
        <div class="account-card-info glass-container">
          <span class="account-name">{{ account.name }}</span>
          <span class="account-number">{{ account.number }}</span>
        </div>
        <div class="account-card-balance">
          <span>{{ account.balance }}</span> <span class="currency-symbol">АР</span>
        </div>
      </a>
    </div>
  </div>
</template>