import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte({
            preprocess: vitePreprocess(),
            compilerOptions: {
                compatibility: {
                    componentApi: 4,
                },
            },
        }),
    ],
    resolve: {
        alias: {
            $lib: path.resolve('./src/lib'),
        },
    },
});
