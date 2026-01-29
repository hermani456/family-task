import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true, // Permite usar 'describe', 'it', 'expect' sin importarlos
        environment: 'node',
        exclude: [...configDefaults.exclude, 'dist', 'build'],
    },
});