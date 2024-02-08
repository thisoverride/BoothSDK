module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testRegex: '(/__tests__/.*|(\.|/)(test|spec))\.(jsx?|tsx?)$',
    roots: ['<rootDir>/src/tests/unit'],
  };
