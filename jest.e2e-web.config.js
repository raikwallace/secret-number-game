module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ["**/?(*.)+(spec|test).[t]s"],
	testPathIgnorePatterns: ['/node_modules/', 'dist'],
	setupFilesAfterEnv: ['<rootDir>/test/e2e/web/jest.setup.ts'],
  transform: {
		"^.+\\.ts?$": "ts-jest"
	},
};
