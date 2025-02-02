<template>
    <div class="flex items-center justify-center"> 
      <div class="w-full max-w-md bg-white shadow-md rounded-lg">
        <div class="p-6 space-y-4">
          <h2 class="text-2xl font-bold text-center text-gray-700">登录刷题系统</h2>
          <p class="text-center text-gray-500">请输入您的密码</p>
          <form @submit.prevent="handleLogin" class="space-y-4">
            <!-- <div class="space-y-2">
              <label for="username" class="block text-sm font-medium text-gray-700">用户名</label>
              <div class="relative">
                <UserIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="username"
                  v-model="username"
                  type="text"
                  placeholder="请输入用户名"
                  class="w-full pl-10 pr-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div> -->
            <div class="space-y-2">
              <label for="password" class="block text-sm font-medium text-gray-700">密码</label>
              <div class="relative">
                <LockIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  placeholder="请输入密码"
                  class="w-full pl-10 pr-3 py-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              登录
            </button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'  
  import { login } from '@/api'
  import { LockIcon } from 'lucide-vue-next'
  
  const password = ref('')
  const router = useRouter()

  const handleLogin = async () => {
    const response = await login(password.value);
    if (response.code === 0) {
        await router.push('/bank');
    } else {
        console.log('Login failed: Invalid credentials');
    }
}

  </script>