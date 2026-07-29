import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    // Fingerprinted filenames let nginx cache assets immutably; index.html stays revalidated.
    assetsDir: 'assets',
    sourcemap: false,
  },
});
