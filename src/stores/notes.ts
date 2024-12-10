import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Note } from '../types/note';

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchNotes = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await response.json();

      // Добавляем поле completed (отметка выполнения) вручную, так как API его не возвращает
      const fetchedNotes: Note[] = data.map((note: { id: number; title: string; body: string }) => ({
        ...note,
        completed: false,
      }));

      // Фильтруем заметки, чтобы избежать дублирования
      const uniqueFetchedNotes = fetchedNotes.filter((fetchedNote: Note) =>
        !notes.value.some((existingNote: Note) => existingNote.id === fetchedNote.id)
      )

      // Добавляем только уникальные заметки
      notes.value.push(...uniqueFetchedNotes);

      console.log('Текущий список заметок:', notes.value);
    } catch (err) {
      error.value = 'Ошибка при загрузке заметок.';
    } finally {
      loading.value = false;
    }
  };


  // Метод добавления новой заметки
  const addNote = (newNote: Omit<Note, 'id'>) => {
    const maxId = notes.value.reduce((max: number, note: Note) => Math.max(max, note.id), 0);
    notes.value.push({ ...newNote, id: maxId + 1, completed: false });
  };

  const toggleCompletion = (id: number) => {
    const index = notes.value.findIndex((n: Note) => n.id === id);
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        completed: !notes.value[index].completed,
      };
    }
  };

  const deleteNote = (id: number) => {
    notes.value = notes.value.filter((n: Note) => n.id !== id);
  };

  return {
    notes,
    loading,
    error,
    fetchNotes,
    addNote, // добавляем метод для добавления новой заметки
    toggleCompletion,
    deleteNote,
  };
});
