export default {
  testEnvironment: 'jsdom',
  
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.{js,jsx}',
    '<rootDir>/server/**/__tests__/**/*.test.{js,jsx}'
  ],
  
  testPathIgnorePatterns: [
    '/node_modules/',
    'test-helpers\\.js$'
  ],
  
  transformIgnorePatterns: [
    'node_modules/(?!(socket.io-client|@testing-library)/)'
  ],
  
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  testTimeout: 30000,
  clearMocks: true,
  verbose: true
};