/** @type {import('jest').Config} */
module.exports = {
  displayName: 'mobile',
  preset: 'jest-expo',
  rootDir: __dirname,
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testMatch: ['<rootDir>/src/**/*.spec.{ts,tsx}'],
  moduleNameMapper: {
    '^@/mobile/(.*)$': '<rootDir>/src/$1',
    '^@junta/contracts$': '<rootDir>/../../libs/contracts/src/index.ts',
    '^@junta/domain$': '<rootDir>/../../libs/domain/src/index.ts',
  },
}
