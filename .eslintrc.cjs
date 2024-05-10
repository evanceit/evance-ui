/* eslint-env node */
module.exports = {
    root: true,
    env: {
        node: true,
        commonjs: true,
        jest: true,
    },
    extends: [
        "prettier",
        "eslint:recommended",
        "plugin:prettier/recommended",
        "plugin:vue/vue3-recommended",
        "@vue/typescript/recommended",
        "@vue/eslint-config-typescript/recommended",
        "@vue/eslint-config-prettier",
    ],
    plugins: ["prettier"],
    rules: {
        "@typescript-eslint/ban-types": ["warn"],
        "@typescript-eslint/explicit-function-return-type": ["off"],
        "@typescript-eslint/no-duplicate-enum-values": ["off"],
        "@typescript-eslint/no-explicit-any": ["off"],
        "@typescript-eslint/no-unused-vars": ["off"],
        "vue/padding-line-between-blocks": ["error", "always"],
        "vue/no-multiple-template-root": "off",
        "vue/no-template-shadow": "off",
        "vue/multi-word-component-names": ["off"],
        "vue/block-order": ["error", { order: ["script", "template", "style"] }],
        "vue/block-lang": ["error", { script: { lang: "ts" } }],
        "comma-dangle": ["error", "always-multiline"],
        'multiline-ternary': ['error', 'always-multiline'],
        "prettier/prettier": [
            "error",
            {
                trailingComma: "all",
                endOfLine: "auto",
                bracketSameLine: true,
            },
        ],
    },
};