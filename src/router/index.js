import { createRouter, createWebHistory } from 'vue-router'
import QuestionBankList from '../views/QuestionBankList.vue'
import QuestionManagement from '../views/QuestionManagement.vue'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/bank',
      name: 'QuestionBankList',
      component: QuestionBankList
    },
    { 
      path: '/bank/:bankId/:bankName', 
      name: 'QuestionManagement', 
      component: QuestionManagement 
    },
    {
      path: '/',
      name: 'Login',
      component: Login
    },
  ]
})

export default router
