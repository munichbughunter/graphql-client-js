import typescript from 'rollup-plugin-typescript2';
import del from 'rollup-plugin-delete';
import dts from 'rollup-plugin-dts';
import json from '@rollup/plugin-json';
import pkg from './package.json';

export default [
    {
        input: 'src/index.ts',
        output: [
            { file: `dist/${pkg.main}`, format: 'cjs' },
            { file: `dist/${pkg.module}`, format: 'esm' },
        ],
        plugins: [
            del({ targets: ['dist/*'] }),
            json(),
            typescript({
                useTsconfigDeclarationDir: true,
            }),
        ],
        external: Object.keys(pkg.peerDependencies || {}),
    },
    {
        input: 'dist/dts/index.d.ts',
        output: [
            { file: 'dist/index.d.ts', format: 'es' },
        ],
        plugins: [
            dts(),
        ],
    },
];
