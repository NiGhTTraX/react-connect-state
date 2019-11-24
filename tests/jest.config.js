const baseConfig = require('tdd-buffet/config/jest.config');

module.exports = {
  ...baseConfig,

  collectCoverageFrom: [
    ...baseConfig.collectCoverageFrom,
    '!playground/**/*'
  ]
};
