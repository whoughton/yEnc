import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'bench.ts',
      name: 'bench',
      fileName: 'bench',
      formats: ['cjs']
    },
    rollupOptions: {
      external: ['tinybench']
    }
  }
}); 