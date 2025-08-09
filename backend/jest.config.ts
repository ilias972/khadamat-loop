export default {
  testEnvironment: 'node',
  transform: { '^.+\\.tsx?$': ['ts-jest', {}] },
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts','tsx','js'],
  verbose: true
};
