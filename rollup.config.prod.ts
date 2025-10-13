import alias from '@rollup/plugin-alias'
import nodeResolve from '@rollup/plugin-node-resolve'
import scss from 'rollup-plugin-scss'
import typescript from '@rollup/plugin-typescript'
import del from 'rollup-plugin-delete'

export default {
  input: 'src/index.tsx',
  output: {
    dir: 'dist',
    format: 'es',
    name: 'lilykiwi.xyz',
    sourcemap: false,
    chunkFileNames: '[name].js',
  },
  plugins: [
    del({ targets: 'dist/*.js.map' }),
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
      outputStyle: 'compressed',
    }),
  ],
}
