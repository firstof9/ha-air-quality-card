import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

const dev = process.env.ROLLUP_WATCH === 'true';

export default {
  input: 'src/air-quality-card.ts',
  output: {
    file: 'air-quality-card.js',
    format: 'es',
    sourcemap: dev,
  },
  plugins: [
    replace({
      preventAssignment: true,
      __CARD_VERSION__: JSON.stringify(process.env.CARD_VERSION || 'dev'),
    }),
    resolve(),
    typescript({
      tsconfig: './tsconfig.json',
      compilerOptions: { noEmit: false, declaration: false },
    }),
    !dev && terser({ format: { comments: false } }),
    {
      name: 'patch-lit-html',
      renderChunk(code) {
        return {
          code: code.replace(/\/-->\/g/g, '/--!?>/g'),
          map: null,
        };
      },
    },
  ].filter(Boolean),
};
