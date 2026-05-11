import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const dev = process.env.ROLLUP_WATCH === 'true';

export default {
  input: 'src/air-quality-card.ts',
  output: {
    file: 'air-quality-card.js',
    format: 'es',
    sourcemap: dev,
  },
  plugins: [
    resolve(),
    typescript({
      tsconfig: './tsconfig.json',
      compilerOptions: { noEmit: false, declaration: false },
    }),
    !dev && terser({ format: { comments: false } }),
  ].filter(Boolean),
};
