// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    parser: "babel-eslint",
  },
  env: {
    browser: true,
    es6: true,
  },
  extends: ["eslint:recommended"],
  // rules: {
  //   "Unexpected token": "off",
  // },
};
