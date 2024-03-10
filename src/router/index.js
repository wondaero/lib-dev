import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'

import BookList from '../views/admin/BookList.vue'
import Book1 from '../views/admin/Book1.vue'
import BookListWithNoClassCde from '../views/admin/BookListWithNoClassCde.vue'
import BorrowedBookList from '../views/admin/BorrowedBookList.vue'
import Borrow from '../views/admin/Borrow.vue'
import Return1 from '../views/admin/Return1.vue'
import UserList from '../views/admin/UserList.vue'
import User1 from '../views/admin/User1.vue'

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
          component: Book1,
        },
        {
          path: 'book1/:book_cde?',
          name: 'book1',
          component: Book1,
        },
        {
          path: 'userlist',
          name: 'userlist',
          component: UserList
        },
        {
          path: 'user1',
          name: 'user1',
          component: User1,
        },
        {
          path: 'user1/:user_cde?',
          name: 'user1',
          component: User1,
        },
        {
          path: 'borrowedBookList',
          name: 'borrowedBookList',
          component: BorrowedBookList
        },
        {
          path: 'borrow',
          name: 'borrow',
          component: Borrow
        },
        {
          path: 'return1',
          name: 'return1',
          component: Return1
        },
        {
          path: 'bookListWithNoClassCde',
          name: 'bookListWithNoClassCde',
          component: BookListWithNoClassCde
        },
      ]
    }
  ]
})

export default router
