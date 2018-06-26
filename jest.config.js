module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig-jest.json',
    },
  },
};
