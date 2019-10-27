#!/usr/bin/env node
require('ts-node/register');
require('ignore-styles');

const fs = require('fs');
const path = require('path');
const { importModule } = require('react-cosmos-shared');
const { findFixtureFiles } = require('react-cosmos-voyager2/server');
const { getComponents } = require('react-cosmos-voyager2/client');
const cosmosConfig = require('./cosmos.config.js');

const {
  rootPath,
  fileMatch,
  exclude
} = cosmosConfig;

const fixturesFile = path.join(__dirname, 'fixtures.json');

findFixtureFiles({ rootPath, fileMatch, exclude }).then(fixtureFiles => {
  const fixtureModules = getFixtureModules(fixtureFiles);
  const components = getComponents({ fixtureModules, fixtureFiles });

  const serialized = components.map(({
    name: componentName,
    namespace: componentNamespace,
    fixtures
  }) => ({
    componentName,
    componentNamespace,

    fixtures: fixtures.map(({
      name: fixtureName,
      namespace: fixtureNamespace
    }) => ({
      fixtureName,
      fixtureNamespace
    }))
  }));

  fs.writeFileSync(fixturesFile, JSON.stringify(serialized, null, ' '));
}).catch(err => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


function getFixtureModules(fixtureFiles) {
  // I don't like this, but it's what the API needs.
  return fixtureFiles.reduce(
    (acc, f) => Object.assign(acc, {
      // eslint-disable-next-line global-require
      [f.filePath]: importModule(require(f.filePath))
    }),
    {}
  );
}
