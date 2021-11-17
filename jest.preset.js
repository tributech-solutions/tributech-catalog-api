const nxPreset = require('@nrwl/jest/preset');
module.exports = {
  ...nxPreset,
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+.(ts|js|html)$': 'ts-jest',
  },
  resolver: '@nrwl/jest/plugins/resolver',
  reporters: [
    'default',
    [
      'jest-junit',
      { outputDirectory: 'reports/test', outputName: `test-${Date.now()}.xml` },
    ],
  ],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['html', 'cobertura'],
  testRunner: 'jest-jasmine2',
};
