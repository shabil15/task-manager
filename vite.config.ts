import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const BACKEND_URL = "http://localhost:5000/"
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:3000,
    proxy:{
      '/api':{ 
        target:BACKEND_URL,
        changeOrigin:true,
        // secure:true
      }
    } 
  }
})