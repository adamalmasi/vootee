import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true, tsconfig: { jsx: 'react' } }],
    '^.+\\.js$': ['ts-jest', { useESM: true }],
  },
  transformIgnorePatterns: ['node_modules/(?!(nanoid)/)'],
}

export default config
