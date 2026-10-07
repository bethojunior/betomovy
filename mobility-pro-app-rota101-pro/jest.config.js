module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    'jest-styled-components',
  ],
  setupFiles: ['<rootDir>/.jest/setup.ts'],
  modulePaths: ['<rootDir>/src/'],
  moduleNameMapper: {
    '^react$': '<rootDir>/node_modules/react',
  },
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
};
