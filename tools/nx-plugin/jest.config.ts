export default {
  displayName: 'nx-plugin',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testPathIgnorePatterns: ['/files/'],
  coverageDirectory: '../../coverage/tools/nx-plugin',
}
