/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/?(*.)+(spec|test).[t]s"],
	testPathIgnorePatterns: ['/node_modules/', 'dist'],
};
