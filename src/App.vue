<template>
  <div class="w-screen h-full bg-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/bank" class="text-xl font-bold text-gray-800">
                刷题系统
              </router-link>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link 
                to="/bank" 
                class="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                active-class="border-indigo-500"
                exact
              >
                题库列表
              </router-link>
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <!-- <button class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span class="sr-only">查看通知</span>
              <BellIcon class="h-6 w-6" />
            </button> -->

            <router-link to="/" class="text-sm font-medium text-gray-700 hover:text-gray-800">
              登录
            </router-link>
            <!-- 个人资料下拉菜单 -->
            <!-- <div class="ml-3 relative">
              <div>
                <button class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" id="user-menu" aria-haspopup="true">
                  <span class="sr-only">打开用户菜单</span>
                  <img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                </button>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto w-full min-h-screen bg-white ">
      <router-view></router-view>
    </main>


    <footer class="bg-white">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-500">
          © 2024 刷题系统.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { BellIcon } from 'lucide-vue-next'
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

</style>