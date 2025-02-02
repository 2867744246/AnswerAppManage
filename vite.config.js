import { defineConfig } from 'vite';  
import vue from '@vitejs/plugin-vue';  
import tailwindcss from 'tailwindcss';  
import autoprefixer from 'autoprefixer';  
import { fileURLToPath } from 'url';  // 导入 fileURLToPath
import { dirname } from 'path'; // 导入 dirname

const __filename = fileURLToPath(import.meta.url); // 获取当前文件的路径
const __dirname = dirname(__filename); // 获取当前文件所在目录

// https://vite.dev/config/  
export default defineConfig({  
 plugins: [  
  vue(),  
 ],  
 resolve: {  
  alias: {  
   '@': fileURLToPath(new URL('./src', import.meta.url)),  
  },  
 },  
 css: {  
  postcss: {  
   plugins: [  
    tailwindcss,  
    autoprefixer,  
   ],  
  },  
 },  
});
