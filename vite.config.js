import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'index.ts',
      name: 'yEnc',
      fileName: (format) => `yenc.${format}.js`,
      formats: ['es', 'umd', 'cjs']
    },
    rollupOptions: {
      output: {
        globals: {
          // Add any global dependencies here if needed
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'node'
  }
}); 