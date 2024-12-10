import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Note {
  id: number;
  title: string;
  body: string;
  completed: boolean;
}

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
      const fetchedNotes = data.map((note: any) => ({
        ...note,
        completed: false,
      }));

      // Фильтруем заметки, чтобы избежать дублирования
      const uniqueFetchedNotes = fetchedNotes.filter(fetchedNote =>
        !notes.value.some(existingNote => existingNote.id === fetchedNote.id)
      );

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
  const addNote = (newNote: Note) => {
    // Генерация уникального id для новой заметки
    const maxId = notes.value.reduce((max, note) => Math.max(max, note.id), 0);
    newNote.id = maxId + 1;

    // Добавляем новую заметку в хранилище
    notes.value.push(newNote);
    console.log('Добавленная заметка:', newNote);
    console.log('Текущий список заметок:', notes.value);
  };

  const toggleCompletion = (id: number) => {
    const index = notes.value.findIndex((n) => n.id === id);
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        completed: !notes.value[index].completed,
      };
    }
  };

  const deleteNote = (id: number) => {
    notes.value = notes.value.filter((n) => n.id !== id);
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
