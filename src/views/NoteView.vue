<template>
  <div>
    <Header />
    <div v-if="note" class="content">
      <h1>{{ note?.title }}</h1>
      <div class="status" :class="{ 'status--completed': note?.completed }">
        Статус: {{ note?.completed ? 'Выполнена' : 'Не выполнена' }}
      </div>
      <button class="button" @click="goBack">Вернуться назад</button>
    </div>
    <div v-else>
      <p>Заметка не найдена или еще загружается...</p>
      <button class="button" @click="goBack">Вернуться назад</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotesStore } from '@/stores/notes';
import type { Note } from '@/types/note';

const route = useRoute();
const router = useRouter();
const store = useNotesStore();
const note = ref<Note | null>(null);

onMounted(async () => {
  const slug = route.params.slug as string;

  // Убедимся, что заметки загружены
  if (!store.notes.length) {
    await store.fetchNotes();
  }

  // Преобразуем slug обратно в строку с пробелами
  const noteTitle = slug.replace(/-/g, ' ');

  // Найдем заметку по преобразованному названию
  note.value = store.notes.find((n: Note) => n.title.toLowerCase() === noteTitle.toLowerCase()) || null;

  // Если заметка не найдена, можно перенаправить обратно на список
  if (!note.value) {
    console.warn(`Note with title "${noteTitle}" not found`);
    router.push('/');
  }
});

const goBack = () => {
  router.push('/');
};
</script>

<style scoped>
@import "@/styles/components/_status.scss";

.content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 16px;
}
</style>
