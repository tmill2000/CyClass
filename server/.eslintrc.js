module.exports = {
    env: {
        node: true,
        commonjs: true,
        es2021: true,
        jest: true
    },
    extends: ["eslint:recommended"],
    plugins: ["prettier"],
    overrides: [],
    parserOptions: {
        ecmaVersion: "latest"
    },
    rules: {
        quotes: ["error", "double"],
        "arrow-body-style": "off",
        "no-plusplus": "off",
        "no-continue": "off",
        "no-useless-catch": "off",
        "no-use-before-define": "off",
        "no-underscore-dangle": "off",
        "prettier/prettier": "error"
    }
};
