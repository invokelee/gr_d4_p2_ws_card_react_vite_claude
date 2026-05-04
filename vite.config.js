import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/gr_d4_p2_ws_card_react_vite_claude/" : "/",
  server: {
    port: 8871,
    strictPort: true,
    host: "0.0.0.0",
  },
})
