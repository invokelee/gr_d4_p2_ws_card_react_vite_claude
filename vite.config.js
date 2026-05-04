import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Actions 빌드(GitHub Pages)일 때만 서브경로 적용, Netlify 등은 "/"
  base: process.env.GITHUB_ACTIONS ? "/gr_d4_p2_ws_card_react_vite_claude/" : "/",
  server: {
    port: 8871,
    strictPort: true,
    host: "0.0.0.0",
  },
})
