import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import ts from '@wessberg/rollup-plugin-ts'
import { uglify } from 'rollup-plugin-uglify'
import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'
import pkg from './package.json'

const banner = `/*!
* ${pkg.name}.js v${pkg.version}
* @${pkg.author}
* Released under the ${pkg.license.toUpperCase()} License.
*/`

const BundleName = pkg.name.split('-').join('_')

const commonOutput = {
    name: BundleName,
    format: 'umd',
    banner,
    globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    exports: 'named',
}

export default {
    input: 'src/index.ts', // 打包入口
    external: ['react', 'react-dom'],
    output: [
        {
            ...commonOutput,
            file: 'dist/index.js',
        },
        {
            ...commonOutput,
            file: 'dist/index.min.js',
            sourcemap: true,
            plugins: [uglify(), terser()],
        },
        {
            ...commonOutput,
            file: 'dist/index.esm.js',
            format: 'es',
        },
    ],
    plugins: [
        // 打包插件
        replace({
            preventAssignment: true,
            values: {
                'process.env.NODE_ENV': JSON.stringify('production'),
                __release_time__: new Date().toString(),
                __release_version__: pkg.version,
            },
        }),
        resolve(), // 查找和打包node_modules中的第三方模块
        commonjs(), // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
        ts(), // 解析TypeScript
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**', // 只编译我们的源代码
        }),
    ],
}
