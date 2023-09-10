import { defineConfig } from 'vite'
export default defineConfig({
    build: {
        lib: {
            entry: 'src/main.ts',
            name: 'VuFetch',
            fileName: (format) => `index.${format}.js`,
            formats: ['es', 'umd','cjs'],
        },
        outDir: "dist"
    }
})