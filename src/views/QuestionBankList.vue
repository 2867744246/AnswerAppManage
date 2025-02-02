<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl text-gray-600 font-bold mb-6">题库管理</h1>
    
    <!-- 添加新题库表单 -->
    <div class="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 class="text-xl text-gray-600 font-semibold mb-4">添加新题库</h2>
      <form @submit.prevent="addQuestionBank" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">题库名称</label>
          <input type="text" id="name" v-model="newBank.name" required
                 class="mt-1 block w-full rounded-md text-gray-700 border-gray-500 shadow focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
        </div>
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">题库描述</label>
          <textarea id="description" v-model="newBank.description"
                    class="mt-1 block w-full rounded-md text-gray-700 border-gray-500 shadow focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"></textarea>
        </div>
        <button type="submit"
                class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          添加题库
        </button>
      </form>
    </div>

    <!-- 现有题库列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="bank in questionBanks" :key="bank.id" class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-xl text-gray-600 font-semibold mb-2">{{ bank.name }}</h2>
        <p class="text-gray-600 mb-4"> {{ bank.description }}</p>
        <p class="text-gray-500 mb-4">题目数量: {{ bank.count }}</p> <!-- 显示题目数量 -->
        <router-link 
          :to="{ name: 'QuestionManagement', params: { bankId: bank.id, bankName: bank.name } }"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          管理题目
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBanks, createBank } from '@/api'

const questionBanks = ref([])
const newBank = ref({ name: '', description: '' })

onMounted(async () => {
  await fetchQuestionBanks()
})

const fetchQuestionBanks = async () => {
  try {
    const response = await getBanks()
    questionBanks.value = response.data // 确保data中包含count字段
    questionBanks.value.forEach(bank => {
      localStorage.setItem(bank.name, bank.count);
    });
  } catch (error) {
    console.error('获取题库列表失败:', error)
  }
}

const addQuestionBank = async () => {
  try {
    await createBank(newBank.value)
    await fetchQuestionBanks() // 重新获取题库列表以包含新添加的题库
    newBank.value = { name: '', description: '' } 
  } catch (error) {
    console.error('添加题库失败:', error)
  }
}
</script>
