/*
 * @Author: SummerJay__
 * @Date: 2021-08-11 22:29:33
 * @LastEditTime: 2021-08-12 14:06:37
 * @LastEditors: your name
 * @Description:
 * @FilePath: \toutiao-publish-admin\.eslintrc.js
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 0,
    'comma-dangle': 0,
    'no-useless-return': 0
  }
}
