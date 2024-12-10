<template>
  <div>
    <h1>Создать заметку</h1>
    <form @submit.prevent="addNote" class="form">
      <div class="form__field">
        <label class="form__label" for="title">Название</label>
        <input
          type="text"
          id="title"
          v-model="title"
          class="input"
          :class="{ 'is-invalid': titleError }"
          required
        />
        <div v-if="titleError" class="error">{{ titleError }}</div>
      </div>

      <div class="form__field">
        <div class="grid grid--center grid--sm-gap">
          <label for="completed">Завершена</label>
          <div class="checkbox-custom">
            <input type="checkbox" id="completed" v-model="completed" />
            <label for="completed" class="checkbox-custom__label" :class="{ checked: completed }"></label>
          </div>
        </div>
      </div>
      <div class="grid grid--sm-gap">
        <button class="button button--add" :disabled="isSubmitDisabled || isSubmitting">Добавить</button>
        <button class="button" @click="goBack">Вернуться к списку</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'

const router = useRouter()
const store = useNotesStore()

// Поля формы
const title = ref('')
const completed = ref(false)

// Ошибки
const titleError = ref<string | null>(null)

// Проверка, можно ли отправить форму
const isSubmitDisabled = computed(() => {
  return !title.value || titleError.value !== null
})

// Функция для добавления новой заметки
const isSubmitting = ref(false)

const addNote = async () => {
  if (isSubmitting.value || isSubmitDisabled.value) return
  isSubmitting.value = true

  try {
    const newNote = {
      id: Date.now(),
      title: title.value,
      body: '',
      completed: completed.value
    }
    store.addNote(newNote)
    console.log('Добавлена новая заметка:', newNote)
    router.push('/')
  } finally {
    isSubmitting.value = false
  }
}

// Валидация для названия
const validateTitle = () => {
  if (title.value.length < 3) {
    titleError.value = 'Название должно содержать хотя бы 3 символа.'
  } else if (title.value.length > 50) {
    titleError.value = 'Название не может превышать 50 символов.'
  } else {
    titleError.value = null
  }
}

const goBack = () => {
  router.push('/')
}

// Добавление валидации при изменении значения поля
watch(title, validateTitle)
</script>

<style scoped>
@import "@/styles/components/_inputs.scss";
@import "@/styles/components/_form.scss";

button:disabled {
  background-color: #aaa;
}

.is-invalid {
  border-color: red;
  background-color: #ffe6e6;
}

.error {
  color: red;
  font-size: 0.9em;
}
</style>
