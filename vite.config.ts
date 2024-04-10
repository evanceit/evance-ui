import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import {resolve} from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts(),
        svgLoader({
            svgo: false
        })
    ],
    build: {
        lib: {
            entry: resolve('./src/entry-bundler.ts'),
            name: 'EvanceUI',
            fileName: 'evance-ui'
        },
        rollupOptions: {
            external: ['vue', 'typescript'],
            output: {
                globals: {
                    vue: 'Vue'
                }
            }
        }
    },
    resolve: {
        alias: [
            {find: /^evance$/, replacement: resolve('./src/framework.ts')},
            {find: /^@\/(.*)/, replacement: resolve('./src/$1')}
        ]
    }
})
