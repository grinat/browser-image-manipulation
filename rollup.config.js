import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default {
    input: 'index.js',
    output: {
        file: 'dist/browser-image-manipulation.js',
        name: 'browser-image-manipulation',
        sourceMap: true,
        format: 'umd'
    },
    plugins: [
        resolve(),
        commonjs(),
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true
        }),
        terser({
            compress: {
                evaluate: false,
                drop_console: true
            }
        })
    ]
}
