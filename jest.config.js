module.exports = {
  preset: 'ts-jest',
  collectCoverageFrom: [
    'src/**/*.ts'
  ],
  testResultsProcessor: './node_modules/jest-junit-reporter',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/build',
    '/node_modules/'
  ],
  coverageThreshold: {
    global: {
      statements: 69,
      branches: 90,
      functions: 40,
      lines: 69
    }
  }
}
