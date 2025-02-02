// src/api.js  
import axios from 'axios';  

const apiClient = axios.create({  
  baseURL: 'http://116.62.5.195:8081', 
  headers: {  
    'Content-Type': 'application/json',  
  },  
});

// 在请求拦截器中设置 token
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // 每次请求前获取最新的 token
  
  // 如果请求的 URL 是登录请求，不设置 token
  if (!config.url.includes('/admin/user/login') && token) {
    config.headers['token'] = token;  // 添加 token 到请求头
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

export const login = async (password) => {  
  try {  
    const response = await apiClient.post('/admin/user/login', {  
      password: password,  
    });  
    // 登录成功后保存 token
    if (response.data) {
      localStorage.setItem('token', response.data.data); // 存储 token 到 localStorage
    }
    return response.data; // 返回 token  
  } catch (error) {  
    console.error('Error logging in:', error);  
    throw error;  
  }  
};

// GET 请求获取题库列表
export const getBanks = async () => {  
  try {  
    const response = await apiClient.get('/admin/bank');  
    return response.data; 
  } catch (error) {          
    console.error('Error getting banks:', error);  
    throw error;  
  }  
};

// POST 请求创建新的题库
export const createBank = async (data) => {
  try {
    const response = await apiClient.post('/admin/bank', data);
    return response.data; // 返回创建成功的题库数据
  } catch (error) {
    console.error('Error creating bank:', error);
    throw error;
  }
};

// 根据题库 ID 获取题目信息
export const getQuestionsByBankId = async (data) => {
  try {
    const response = await apiClient.get(`/admin/question/`, {
      params: data,
    });
    if (response.data && response.data.code === 0) {
      return response.data; // 返回题目信息
    } else {
      throw new Error(response.data.msg); // 处理错误信息
    }
  } catch (error) {
    console.error('Error fetching question:', error);
    throw error;
  }
};

// POST 请求新增题目
export const createQuestion = async (data) => {
  try {
    const response = await apiClient.post('/admin/question', data);
    return response.data; // 返回创建成功的题目数据
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
};

// PUT 请求修改题目
export const updateQuestion = async (id,data) => {
  try {
    const response = await apiClient.put(`/admin/question/${id}`, data);
    return response.data; // 返回修改成功的题目数据
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

// DELETE 请求删除题目
export const apiDeleteQuestion = async (id) => {
  try {
    const response = await apiClient.delete(`/admin/question/${id}`);
    return response.data; // 返回删除成功的题目 ID
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};