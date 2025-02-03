import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

const name = 'index'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      copyDtsFiles: true
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name,
      fileName: format => `${name}.${format}.${format === 'es' ? 'm' : ''}js`,
      cssFileName: 'style'
    },
    rollupOptions: {
      external: [
        'vue',
        '@vueuse/core',
        '@floating-ui/vue'
      ],
      output: {
        globals: {
          vue: 'Vue',
          '@vueuse/core': 'VueUse',
          '@floating-ui/vue': 'FloatingUIVue'
        },
        exports: 'named'
      }
    }
  }
})
