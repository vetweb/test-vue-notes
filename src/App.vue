<script setup lang="ts">
import { RouterView } from 'vue-router';

</script>

<template>
<!--  <Header />-->

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
main {
  width: 100%;
  padding: 2rem;
  max-width: 1200px;
  margin: 2rem auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
