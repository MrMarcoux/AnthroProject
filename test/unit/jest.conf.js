const path = require('path')

module.exports = {
  testURL: 'http://localhost/',
  rootDir: path.resolve(__dirname, '../../'),
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.(js)$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  testPathIgnorePatterns: [
    '<rootDir>/test/e2e'
  ],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  setupFiles: ['<rootDir>/test/unit/setup'],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    'src/models/*.{ts,tsx}',
    '!src/main.js',
    '!src/**/*.d.ts',
    '!src/router/index.js',
    '!**/node_modules/**'
  ]
}
