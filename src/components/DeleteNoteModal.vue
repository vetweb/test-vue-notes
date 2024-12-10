<template>
  <Modal @close="$emit('cancel')">
    <template #header>
      <h2>Удалить заметку</h2>
    </template>
    <template #body>
      <p>Вы уверены, что хотите удалить эту заметку?</p>
    </template>
    <template #footer>
      <button class="delete-button" @click="$emit('confirm')">Удалить</button>
      <button class="cancel-button" @click="$emit('cancel')">Отмена</button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
defineEmits(['confirm', 'cancel']);
</script>

<style scoped>
.delete-button {
  background-color: #ff4d4f;
  color: white;
}
</style>
