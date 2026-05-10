import { defineConfig } from 'vite';
import { resolve, join, relative } from 'path';
import { readdirSync, statSync } from 'fs';

function discoverHtmlFiles(
  dir: string,
  root: string,
  entries: Record<string, string> = {},
): Record<string, string> {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      discoverHtmlFiles(full, root, entries);
    } else if (name === 'index.html') {
      const key = relative(root, full)
        .replace(/[\\/]/g, '-')
        .replace(/\.html$/, '');
      entries[key] = full;
    }
  }
  return entries;
}

export default defineConfig({
  resolve: {
    alias: {
      '@widgets': resolve(__dirname, 'src/widgets'),
      '@components': resolve(__dirname, 'src/components'),
      '@state': resolve(__dirname, 'src/state'),
      '@services': resolve(__dirname, 'src/services'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@translations': resolve(__dirname, 'translations'),
    },
  },

  build: {
    outDir: 'dist-playground',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...discoverHtmlFiles(resolve(__dirname, 'playground'), __dirname),
      },
    },
  },
});
