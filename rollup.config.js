import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import del from 'rollup-plugin-delete';

const packageJson = require("./package.json");

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: true,
            },
        ],
        plugins: [
            del({
                targets: 'dist/lib/*',
                runOnce: true,
                verbose: true,
            }),
            resolve(),
            typescript({
                tsconfig: "./tsconfig.json",
                compilerOptions: {
                    "outDir": "./tsout",
                },
                include: [
                    "src/*",
                ]
            }),
        ],
    },
    {
        input: "dist/lib/tsout/index.d.ts",
        output: [{ file: "dist/lib/index.d.ts", format: "esm" }],
        plugins: [dts()],
    },
];