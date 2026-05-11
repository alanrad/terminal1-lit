import { defineConfig } from 'vite';
import { resolve, join } from 'path';
import { readdirSync, statSync } from 'fs';

// Discover all widget entry points under src/widgets/<name>/index.ts
function discoverWidgets(dir: string): Record<string, string> {
  const entries: Record<string, string> = {};
  for (const name of readdirSync(dir)) {
    const entry = join(dir, name, 'index.ts');
    try {
      statSync(entry);
      entries[`widgets/${name}`] = entry;
    } catch {
      // skip directories without an index.ts
    }
  }
  return entries;
}

const widgetsDir = resolve(__dirname, 'src/widgets');

export default defineConfig(({ mode }) => ({
  publicDir: false,

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
    lib: {
      // SDK loader as the default entry; individual widgets are also emitted
      entry: {
        'sdk/loader': resolve(__dirname, 'src/sdk/loader.ts'),
        ...discoverWidgets(widgetsDir),
      },
      formats: ['es'],
    },
    rollupOptions: {
      // Do NOT externalise Lit — widgets must be self-contained for CDN use
      output: {
        // Each entry chunk stays in its own file; shared code is split automatically
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    sourcemap: mode === 'development',
    minify: mode === 'production',
    target: 'es2020',
  },

  server: {
    port: 3000,
    open: '/playground/',
  },

  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**'],
      exclude: ['src/sdk/loader.ts'],
    },
  },
}));
