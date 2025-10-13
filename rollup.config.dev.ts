import alias from '@rollup/plugin-alias'
import nodeResolve from '@rollup/plugin-node-resolve'
import scss from 'rollup-plugin-scss'
import typescript from '@rollup/plugin-typescript'
import serve from 'rollup-plugin-serve'

export default {
  input: 'src/index.tsx',
  output: {
    dir: 'dist',
    format: 'es',
    name: 'lilykiwi.xyz',
    sourcemap: true,
    chunkFileNames: '[name].js',
  },
  watch: {
    clearScreen: true,
    include: 'src/**/*',
    chokidar: {
      usePolling: true,
    },
  },
  plugins: [
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
        { find: 'react-dom', replacement: 'preact/compat' },
        { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
      ],
    }),
    nodeResolve(),
    typescript(),
    scss({
      fileName: 'bundle.css',
    }),
    serve('dist'),
  ],
}
