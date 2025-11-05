import { defineConfig } from 'vite';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import path from 'path';

export default defineConfig({
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
    }),
    copy({
      targets: [
        {
          src: '*.scss',
          dest: 'dist/styles'
        }
      ],
      hook: 'writeBundle',
      flatten: true
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: 'ZjlabFrontierMarkdown',
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    outDir: './dist'
  }
});