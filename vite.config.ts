import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader({
      svgo: false
    })
  ],
  resolve: {
    alias: [
      { find: /^evance$/, replacement: resolve('./src/framework.ts') },
      { find: /^@\/(.*)/, replacement: resolve('./src/$1')}
    ]
  }
})
