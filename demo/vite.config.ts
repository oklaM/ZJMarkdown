import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [
        resolve(__dirname, '..'), // 允许访问父目录
      ],
    },
  },
  resolve: {
    alias: {
      // 强制使用单一版本的React
      'react': resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom'),
    },
    // 确保相同的依赖不会被重复打包
    dedupe: ['react', 'react-dom'],
  },
})
