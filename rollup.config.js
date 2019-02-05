import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

export default {
    entry: 'index.js',
    format: 'umd',
    moduleName: 'browser-image-manipulation',
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**'
        }),
        uglify(),
        commonjs()
    ],
    sourceMap: true,
    dest: 'dist/browser-image-manipulation.js'
}
