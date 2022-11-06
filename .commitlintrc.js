/**
 * commitlint config
 * @ref http://commitlint.js.org/
 * @desc 由 @isyscore/cli@1.14.0 于 2021-01-01 16:03:38 自动生成
 */

module.exports = {
    extends: [
        // base
        '@commitlint/config-conventional'
    ],
    rules: {
        'type-enum': [2, 'always', [
          'feat', 'update', 'fix', 'refactor', 'optimize', 'style', 'docs', 'chore'
        ]],
        'type-case': [0],
        'type-empty': [0],
        'scope-empty': [0],
        'scope-case': [0],
        'subject-full-stop': [0, 'never'],
        'subject-case': [0, 'never'],
        'header-max-length': [0, 'always', 72]
      }
};
