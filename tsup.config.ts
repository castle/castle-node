import { defineConfig } from 'tsup';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  target: 'es2022',
  platform: 'node',
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
});
