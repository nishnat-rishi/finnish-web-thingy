module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true,
    'jest/globals': true,
    'cypress/globals': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:cypress/recommended'
  ],
  'plugins': [
    'react',
    'react-hooks',
    'jest',
    'cypress'
  ],
  'parser': 'babel-eslint',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  'rules': {
    'indent': [
      'warn',
      2,
      {
        'SwitchCase': 1
      }
    ],
    'linebreak-style': [
      'warn',
      'unix'
    ],
    'quotes': [
      'warn',
      'single'
    ],
    'semi': [
      'warn',
      'never'
    ],
    'arrow-spacing': [
      'warn',
      {
        'before': true,
        'after': true
      }
    ],
    'space-before-function-paren': [ 'warn', {
      'anonymous': 'always',
      'named': 'always',
      'asyncArrow': 'always'
    } ],
    'comma-spacing': [
      'warn',
      {
        'before': false,
        'after': true
      }
    ],
    'object-curly-spacing': [
      'warn',
      'always'
    ],
    'array-bracket-spacing': [
      'warn',
      'always'
    ],
    'no-trailing-spaces': 'warn',
    'no-unused-vars': [
      'warn'
    ],
    'jsx-quotes': [
      'warn',
      'prefer-single'
    ],
    'eqeqeq': 'error',
    'react/prop-types': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  'settings': {
    'react': {
      'version': 'detect'
    }
  }
}