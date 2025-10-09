import alias from '@rollup/plugin-alias';
import html from '@rollup/plugin-html';
import nodeResolve from '@rollup/plugin-node-resolve';
import scss from 'rollup-plugin-scss';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.tsx',
  output: {
    dir: 'output',
    format: 'es',
    name: 'lilykiwi.xyz',
    sourcemap: false,
    chunkFileNames: '[name].js'
  },
  watch: {
    clearScreen: false,
    include: "src/**/*",
    chokidar: {
      usePolling: true
    }
  },
  plugins: [
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
        { find: 'react-dom', replacement: 'preact/compat' },
        { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' }
      ]
    }),
    nodeResolve(),
    typescript(),
    scss({
      fileName: 'bundle.css',
      outputStyle: 'compressed'
    }),
    html({
      title: 'lilykiwi.xyz',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width,initial-scale=1' }
      ]
    }),
  ],
};
