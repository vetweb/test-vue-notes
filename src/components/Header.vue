<template>
  <header class="header">
    <nav class="nav">
      <router-link to="/">Список заметок</router-link>
      <router-link to="/add">Добавить заметку</router-link>
    </nav>
  </header>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.header {
  padding: 1rem;
  background-color: #12182b;
  color: white;
}
.nav {
  display: flex;
  gap: 1rem;
}
</style>
