<template>
  <Modal @close="$emit('cancel')">
    <template #header>
      <h2>Редактировать</h2>
    </template>
    <template #body>
      <div class="modal-body">
        <label for="editTitle">Название</label>
        <input
          id="editTitle"
          v-model="localNote.title"
          type="text"
          placeholder="Введите название"
        />
      </div>
    </template>
    <template #footer>
      <button class="save-button" @click="saveEdit">Сохранить</button>
      <button class="cancel-button" @click="$emit('cancel')">Отмена</button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';

defineProps({
  note: Object,
});

defineEmits(['save', 'cancel']);

const localNote = ref({ ...note });

watch(note, () => {
  localNote.value = { ...note };
});

const saveEdit = () => {
  $emit('save', localNote.value);
};
</script>

<style scoped>
.modal-body {
  margin-bottom: 16px;
}
</style>
