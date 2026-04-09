import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vue()],
  build: {
    outDir: 'dist',
    lib: {
      entry: {
        react: resolve(__dirname, 'src/react/DragSortList.tsx'),
        vue: resolve(__dirname, 'src/vue/DragSortList.vue'),
        core: resolve(__dirname, 'src/core/drag-sort.ts')
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        return `${entryName}/index.${format === 'es' ? 'mjs' : 'js'}`
      }
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'vue'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          vue: 'Vue'
        }
      },
      // 禁用 CSS 输出
      plugins: [
        {
          name: 'remove-css',
          generateBundle(_options, bundle) {
            Object.keys(bundle).forEach(key => {
              if (bundle[key].type === 'asset' && bundle[key].fileName.endsWith('.css')) {
                delete bundle[key];
              }
            });
          }
        }
      ]
    },
    emptyOutDir: true
  }
})