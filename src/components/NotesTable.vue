<template>
  <div>
    <h1>Список заметок</h1>
    <button @click="goToAddNote" class="button button--add">Добавить заметку</button>

    <!-- Заголовок -->
    <div class="notes-header">
      <div class="notes-header__item">#</div>
      <div class="notes-header__item">Название</div>
      <div
        class="filter-toggle notes-header__item"
        :class="{ active: showCompletedOnly }"
        @click="toggleFilter"
      >
        Выполнено
      </div>
      <div class="notes-header__item">Действия</div>
    </div>

    <!-- Список заметок -->
    <div class="notes-list">
      <div
        v-for="(note, index) in filteredNotes"
        :key="note.id"
        class="note-row"
        :class="{ completed: note.completed }"
      >
        <div class="note-index">{{ index + 1 }}</div>
        <div class="note-title">
          <RouterLink :to="`/todo/${note.title.replace(/\s+/g, '-').toLowerCase()}`">{{ note.title }}</RouterLink>
        </div>
        <div class="note-completed">
          <div class="checkbox-custom">
            <input
              type="checkbox"
              :checked="note.completed"
              @change="() => store.toggleCompletion(note.id)"
              :id="'checkbox-' + note.id"
            />
            <label :for="'checkbox-' + note.id" class="checkbox-custom__label" :class="{ checked: note.completed }"></label>
          </div>
        </div>
        <div class="note-actions">
          <button class="button" @click="openEditModal(note)">Редактировать</button>
          <button class="button button--delete" @click="openDeleteModal(note)">Удалить</button>
        </div>
      </div>
    </div>

    <!-- Модалки -->
    <Modal v-if="isEditModalOpen" @close="cancelEdit">
      <template #header><h2>Редактировать</h2></template>
      <template #body>
        <div class="modal-body">
          <div class="form">
            <label class="form__label" for="editTitle">Название</label>
            <input id="editTitle" v-model="editedNote.title" type="text" class="input" placeholder="Введите название" />
          </div>
        </div>
      </template>
      <template #footer>
        <button class="button button--add" @click="saveEdit">Сохранить</button>
        <button class="button" @click="cancelEdit">Отмена</button>
      </template>
    </Modal>

    <Modal v-if="isDeleteModalOpen" @close="closeDeleteModal">
      <template #header>
        <h2>Удалить заметку</h2>
      </template>
      <template #body>
        <p>Вы уверены, что хотите удалить эту заметку?</p>
      </template>
      <template #footer>
        <button class="button button--delete" @click="deleteNote">Удалить</button>
        <button class="button" @click="closeDeleteModal">Отмена</button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useNotesStore } from '@/stores/notes';
import type { Note } from '../types/note';
import { useRoute, useRouter } from 'vue-router';
import Modal from '@/components/Modal.vue';

const store = useNotesStore();
const route = useRoute();
const router = useRouter();

// Загружаем заметки при монтировании компонента
onMounted(() => {
  store.fetchNotes();
  // Проверяем параметр completed=true в URL
  if (route.query.completed === 'true') {
    showCompletedOnly.value = true;
  }
});

// Перенаправление на страницу добавления заметки
const goToAddNote = () => {
  router.push('/add');
};

// Фильтрация выполненных заметок
const showCompletedOnly = ref(false);
const filteredNotes = computed(() => {
  return showCompletedOnly.value
    ? store.notes.filter((note: Note) => note.completed)
    : store.notes;
});

// Управление модальными окнами
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedNote = ref<Note | null>(null);
// Управление модальным окном редактирования
const editedNote = ref({ id: 0, title: '', body: '', completed: false });

// Открытие модалки редактирования
const openEditModal = (note: Note) => {
  editedNote.value = { ...note }; // Создаем копию заметки для редактирования
  isEditModalOpen.value = true;
  blockScroll(true); // Блокируем прокрутку страницы
};

// Сохранение изменений заметки
const saveEdit = () => {
  store.notes = store.notes.map((note: Note) =>  // Указан тип для параметра
    note.id === editedNote.value.id ? { ...editedNote.value } : note
  );
  cancelEdit();
};


// Отмена редактирования
const cancelEdit = () => {
  isEditModalOpen.value = false;
  editedNote.value = { id: 0, title: '', body: '', completed: false };
  blockScroll(false); // Разблокируем прокрутку страницы
};

// Открытие модалки удаления
const openDeleteModal = (note: Note) => {
  selectedNote.value = note || null; // Гарантируем, что selectedNote всегда корректно обновлено.
  isDeleteModalOpen.value = true;
};

// Закрытие модалки удаления
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  selectedNote.value = null;
};

// Подтверждение удаления заметки
const deleteNote = () => {
  if (!selectedNote.value) {
    console.error('Нет выбранной заметки для удаления.');
    return;
  }

  // Убираем проверку на null, так как она уже была выполнена выше
  store.notes = store.notes.filter((note: Note) => note.id !== selectedNote.value!.id);
  closeDeleteModal();
};

// Блокировка прокрутки
const blockScroll = (block: boolean) => {
  document.body.style.overflow = block ? 'hidden' : '';
};

// Тоггл фильтра
const toggleFilter = () => {
  showCompletedOnly.value = !showCompletedOnly.value;
  const params = { ...route.query };
  if (showCompletedOnly.value) {
    params.completed = 'true';
  } else {
    delete params.completed;
  }
  router.push({ query: params });
};

// Следим за изменением фильтра
watch(showCompletedOnly, (newVal) => {
  const params = { ...route.query };
  if (newVal) {
    params.completed = 'true';
  } else {
    delete params.completed;
  }
  router.push({ query: params });
});
</script>

<style scoped>
@import "@/styles/components/_form.scss";
@import "@/styles/components/_inputs.scss";

/* Основной контейнер */
.notes-header,
.note-row {
  display: grid;
  grid-template-columns: 50px 1fr 80px .45fr;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid #ddd;
}

.notes-header {
  font-weight: bold;
  background-color: #f8f9fa;
}
.notes-header__item {
  font-weight: 700;
}
.note-row {
  background-color: #fff;
  transition: background-color 0.3s ease;
}

.note-row.completed {
  background-color: #d4edda;
}

/* Стили для кнопок */
.note-actions {
  display: flex;
  gap: 8px;
}

.filter-toggle {
  cursor: pointer;
  text-align: center;
}

.filter-toggle.active {
  color: #4caf50;
}

/* Дополнительные стили */
.note-completed {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
