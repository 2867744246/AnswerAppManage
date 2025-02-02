<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl text-gray-600 font-bold mb-6">{{ bankName }} - 题目管理</h1>
    
    <div class="flex justify-between mb-4">
      <button @click="openDialog()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <PlusIcon class="inline-block mr-2 h-4 w-4" /> 添加题目
      </button>
      <div>
        <input type="file" accept=".csv" @change="handleImport" class="hidden" id="csv-upload" />
        <label for="csv-upload" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2 cursor-pointer">
          <FileUpIcon class="inline-block mr-2 h-4 w-4" /> 导入题目
        </label>
        <button @click="exportQuestions" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
          <FileDownIcon class="inline-block mr-2 h-4 w-4" /> 导出题目
        </button>
      </div>
    </div>

    <table class="min-w-full bg-white text-gray-600">
      <thead>
        <tr>
          <th class="py-2 px-4 border-b">内容</th>
          <th class="py-2 px-4 border-b">选项</th>
          <th class="py-2 px-4 border-b">正确答案</th>
          <th class="py-2 px-4 border-b">题目类型</th>
          <th class="py-2 px-4 border-b">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="question in questions" :key="question.id">
          <td class="py-2 px-4 border-b" v-html="question.displayContent"></td>
          <td class="py-2 px-4 border-b">
            <div v-for="option in question.options" :key="option.name">
              {{ option.name }}. {{ option.content }}
            </div>
          </td>
          <td class="py-2 px-4 border-b">{{ question.answer.join(', ') }}</td>
          <td class="py-2 px-4 border-b">
            <select v-model="question.type" @change="updateQuestionType(question)" class="mt-1 block w-full rounded-md text-gray-700 border-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <option value="single">单选</option>
              <option value="multiple">多选</option>
            </select>
          </td>
          <td class="py-2 px-4 border-b">
            <button @click="openDialog(question)" class="text-blue-500 hover:text-blue-700 mr-2">
              <PencilIcon class="inline-block h-4 w-4" />
            </button>
            <button @click="deleteQuestion(question.id)" class="text-red-500 hover:text-red-700">
              <Trash2Icon class="inline-block h-4 w-4" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="flex text-gray-700 items-center justify-center mt-4">
        <label for="pageSize" class="mr-2">每页题目数量:</label>
        <select id="pageSize" v-model="pageSize" @change="fetchQuestions" class="border rounded p-2">
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10">10</option>
        </select>
    </div>
    <div class="flex justify-between items-center text-gray-700 mt-4">
      <button @click="prevPage" :disabled="pageNum <= 0" class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded">
        上一页
      </button>
      <span>第 {{ pageNum + 1 }} 页</span>
      <button @click="nextPage" :disabled="pageNum >= totalPages" class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded">
        下一页
      </button>
    </div>

    <div v-if="isDialogOpen" class="fixed inset-0 bg-gray-600 text-gray-700 bg-opacity-50 overflow-y-auto h-full w-full">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">{{ currentQuestion.id ? '编辑题目' : '添加题目' }}</h3>
        <div class="mb-4">
          <label for="type" class="block text-sm font-medium text-gray-700">题目类型</label>
          <select id="type" v-model="currentQuestion.type" class="mt-1 block w-full rounded-md text-gray-700 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" @change="onTypeChange">
            <option value="single">单选</option>
            <option value="multiple">多选</option>
          </select>
        </div>
        <div v-if="currentQuestion.type">
          <div class="mb-4">
            <label for="content" class="block text-sm font-medium text-gray-700">内容</label>
            <textarea id="content" v-model="currentQuestion.content" rows="3" class="mt-1 block w-full rounded-md text-gray-700 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
          </div>
          <div v-for="(option, index) in currentQuestion.options" :key="index" class="mb-2">
            <label :for="'option' + option.name" class="block text-sm font-medium text-gray-700">选项 {{ option.name }}</label>
            <input :id="'option' + option.name" v-model="option.content" type="text" class="mt-1 block w-full rounded-md text-gray-700 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          </div>
          <button @click="addOption" v-if="currentQuestion.options.length < 4" class="mb-4 text-blue-500 hover:text-blue-700">
            添加选项
          </button>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">正确答案</label>
            <div v-if="currentQuestion.type === 'single'">
              <div v-for="option in currentQuestion.options" :key="option.name" class="flex items-center mt-1">
                <input   
                  type="radio"  
                  :id="'answer' + option.name"  
                  :value="option.name"  
                  v-model="answerModel"   
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"  
                />  
                <label :for="'answer' + option.name" class="ml-2 block text-sm text-gray-900">  
                  {{ option.name }}  
                </label>  
              </div>  
            </div>  
            <div v-else-if="currentQuestion.type === 'multiple'">  
              <div v-for="option in currentQuestion.options" :key="option.name" class="flex items-center mt-1">  
                <input   
                  type="checkbox"   
                  :id="'answer' + option.name"   
                  :value="option.name"   
                  v-model="answerModel"   
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"   
                />  
                <label :for="'answer' + option.name" class="ml-2 block text-sm text-gray-900">  
                  {{ option.name }}  
                </label>  
              </div>  
            </div>  
          </div>   
        </div>
        <div class="flex justify-end">
          <button @click="closeDialog" class="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2">取消</button>
          <button @click="saveQuestion" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

// Vue Composition API 导入
import { ref, onMounted, nextTick } from 'vue';
// Vue Router 导入
import { useRoute } from 'vue-router';
// 图标组件导入
import { PlusIcon, FileUpIcon, FileDownIcon, PencilIcon, Trash2Icon, Check } from 'lucide-vue-next';
// API 方法导入
import { getQuestionsByBankId, createQuestion, updateQuestion, apiDeleteQuestion } from '@/api';  

import 'katex/dist/katex.min.css';
import katex from 'katex';

// 初始化路由
const route = useRoute();
// 从路由获取 bankId 和 bankName
const bankId = route.params.bankId;
const bankName = route.params.bankName;

// 定义响应式数据
const questions = ref([]);
const currentQuestion = ref({ 
    id: null, 
    content: '', 
    options: [{ name: 'A', content: '' }, { name: 'B', content: '' }], 
    answer: [], 
    type: '' 
});
const isDialogOpen = ref(false);
const pageNum = ref(0);  // 当前页
const pageSize = ref(10); // 每页显示的问题数
const totalPages = ref(1); // 总页数
const answerModel = ref([]); // answerModel 用于记录选择的答案
// 组件挂载后获取题目
onMounted(() => {
  fetchQuestions();
});
      
// 渲染数学公式的函数
const renderMath = (input) => {
  try {
    // 创建一个容器用于渲染 KaTeX 内容
    const container = document.createElement('span');
    katex.render(input, container); // 使用 katex.render 渲染内容
    return container.innerHTML; // 返回渲染后的 HTML
  } catch (error) {
    console.error('KaTeX 渲染错误:', error);
    return input; // 如果渲染失败，返回原始内容
  }
};

// 获取题目的异步函数
const fetchQuestions = async () => {  
    try {  
        const response = await getQuestionsByBankId({ bankId: Number(bankId), pageNum: pageNum.value, pageSize: pageSize.value });  
        if (response.code === 0) { 
            questions.value = response.data.map(question => {
              if (bankName === '数学'|| bankName === '物理' || bankName === 'Math')
                return {
                    ...question,
                    content: question.content, // 保持原始 LaTeX 文本
                    displayContent: renderMath(question.content), // 渲染数学题库中的公式内容
                    type: question.answer.length === 1 ? 'single' : 'multiple'
                };
              else
                return {
                  ...question,
                    content: question.content, 
                    displayContent: question.content, 
                    type: question.answer.length === 1 ? 'single' : 'multiple'
                  }
            });
        } else {  
            console.error('获取题目失败:', response.msg);  
        }  
    } catch (error) {  
        console.error('获取题目失败:', error);  
    }
};



// 打开对话框的函数
const openDialog = (question = { 
    id: null, 
    bankId: Number(bankId), 
    content: '', 
    options: [{ name: 'A', content: '' }, { name: 'B', content: '' }], 
    answer: [],
    type: ''
}) => {
    currentQuestion.value = JSON.parse(JSON.stringify(question));
    isDialogOpen.value = true;
}

// 关闭对话框的函数
const closeDialog = () => {
  isDialogOpen.value = false;
  currentQuestion.value = { id: null, content: '', options: [{ name: 'A', content: '' }, { name: 'B', content: '' }], answer: [], type: '' };
}

// 添加选项的函数
const addOption = () => {
  if (currentQuestion.value.options.length < 4) {
    const newOptionName = ['A', 'B', 'C', 'D'][currentQuestion.value.options.length];
    currentQuestion.value.options.push({ name: newOptionName, content: '' });
  }
}

// 保存题目的异步函数
const saveQuestion = async () => {
    if (!currentQuestion.value.content || currentQuestion.value.options.length < 2) {
        alert('请填写题目内容和至少两个选项');
        return; // 阻止保存
    }

    const questionData = {
        bankId: Number(bankId),
        content: currentQuestion.value.content,
        options: currentQuestion.value.options.map(option => ({ name: option.name, content: option.content })),
        answer: answerModel.value.length != 1 ? answerModel.value : [answerModel.value],
    };

    if (currentQuestion.value.id) {
        await updateQuestion(currentQuestion.value.id, questionData);
    } else {
        await createQuestion(questionData);
    }
    await fetchQuestions();
    closeDialog();
}

// 删除题目的异步函数
const deleteQuestion = async (id) => {
  try {
    const response = await apiDeleteQuestion(id);
    if (response.code === 0) {
      await fetchQuestions();
    } else {
      console.error('删除题目失败:', response.msg);
    }
  } catch (error) {
    console.error('删除题目失败:', error);
  }
}

// 导入和导出逻辑
const handleImport = (event) => {
    console.log('Import functionality not implemented yet');
}

const exportQuestions = () => {
    console.log('Export functionality not implemented yet');
}

// 分页控制逻辑
const nextPage = () => {
  if (pageNum.value < totalPages.value) {
    pageNum.value++;
    fetchQuestions();
  }
};

const prevPage = () => {
  if (pageNum.value > 0) {
    pageNum.value--;
    fetchQuestions();
  }
};

// 当题目类型改变时的处理函数
const onTypeChange = () => {
  currentQuestion.value.content = '';
  currentQuestion.value.options = [{ name: 'A', content: '' }, { name: 'B', content: '' }];
  answerModel.value = [];
}

// 更新题目类型的异步函数
const updateQuestionType = async (question) => {
  try {
    const response = await updateQuestion(question.id, { type: question.type });
    if (response.code === 0) {
      console.log('更新题目类型成功:', question);
    } else {
      console.error('更新题目类型失败:', response.msg);
    }
  } catch (error) {
    console.error('更新题目类型失败:', error);
  }
}
</script>
