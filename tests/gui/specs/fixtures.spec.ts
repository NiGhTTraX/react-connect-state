// @ts-ignore because this is an artifact
// eslint-disable-next-line import/no-unresolved
import components from '../../../playground/fixtures.json';
import { describe, loadFixture, vit } from '../suite';

// Some components might render things like portals which need to be handled
// differently.
const componentSelectors: {[componentName: string]: string} = {
  ProxyBuffet: '#root' // because it has fixed positioning and we're interested in the layout
};

interface Fixture {
  fixtureName: string;
  fixtureNamespace: string;
}

interface ComponentFixtures {
  componentName: string;
  componentNamespace: string;
  fixtures: Fixture[]
}

(components as ComponentFixtures[]).forEach(({ componentName, componentNamespace, fixtures }) => {
  let componentPath: string;

  if (componentNamespace) {
    componentPath = `${componentNamespace}/${componentName}`;
  } else {
    componentPath = componentName;
  }

  const selector = componentSelectors[componentName];

  describe(componentPath, () => {
    fixtures.forEach(({ fixtureName, fixtureNamespace }) => {
      vit(fixtureName, async () => {
        let fixturePath;

        if (fixtureNamespace) {
          fixturePath = `${fixtureNamespace}/${fixtureName}`;
        } else {
          fixturePath = fixtureName;
        }

        await loadFixture(componentPath, fixturePath);
      }, selector);
    });
  });
});
