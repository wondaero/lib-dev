import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'

import BookList from '../views/admin/BookList.vue'
import Book1 from '../views/admin/Book1.vue'
import BookListWithNoAuthorCde from '../views/admin/BookListWithNoAuthorCde.vue'
import LentBookList from '../views/admin/LentBookList.vue'
import UserList from '../views/admin/UserList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView 
    },
    {
      path: '/admin',
      name: 'admin',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AdminView,
      children: [
        {
          path: 'booklist',
          name: 'booklist',
          component: BookList
        },
        {
          path: 'book1',
          name: 'book1',
          component: Book1
        },
        {
          path: 'userlist',
          name: 'userlist',
          component: UserList
        },
        {
          path: 'lentbooklist',
          name: 'lentbooklist',
          component: LentBookList
        },
        {
          path: 'booklistwidthnoauthorcde',
          name: 'booklistwidthnoauthorcde',
          component: BookListWithNoAuthorCde
        },
      ]
    }
  ]
})

export default router
