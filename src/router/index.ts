import { createRouter, createWebHistory } from 'vue-router'
import NotesList from '../views/NotesList.vue'
import NoteView from '../views/NoteView.vue'
import AddNote from '../views/AddNote.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: NotesList },
    { path: '/todo/:slug', component: NoteView, props: true },
    { path: '/add', component: AddNote }
  ]
})

export default router
