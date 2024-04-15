import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import {resolve} from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
            exclude: [
                '**/*.stories.ts',
                '**/*.test.ts'
            ]
        }),
        svgLoader({
            svgo: false
        })
    ],
    build: {
        lib: {
            entry: resolve('./src/entry-bundler.ts'),
            name: 'EvanceUI',
            formats: ["es", "cjs", "umd"],
            fileName: format => `evance-ui.${format}.js`
        },
        rollupOptions: {
            external: ['vue', 'typescript'],
            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'style.css') return 'evance-ui.css';
                    return assetInfo.name;
                },
                exports: "named",
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
