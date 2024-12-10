<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-container" ref="modal">
      <header class="modal-header">
        <slot name="header"></slot>
        <button class="modal-close" @click="close">×</button>
      </header>
      <main class="modal-body">
        <slot name="body"></slot>
      </main>
      <footer class="modal-footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, defineEmits, ref } from 'vue';

// Определение события 'close', которое не принимает аргументов
const emit = defineEmits<{
  (e: 'close'): void;
}>();

// Функция для закрытия модального окна и вызова события
const close = () => {
  emit('close');
};

// Блокировка прокрутки при открытии модального окна
const blockScroll = (block: boolean) => {
  document.body.style.overflow = block ? 'hidden' : '';
};

// Управляем блокировкой прокрутки при монтировании компонента
onMounted(() => blockScroll(true));
onUnmounted(() => blockScroll(false));

</script>

<style scoped>
@import "@/styles/components/_modal.scss";
</style>
