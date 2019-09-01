// @ts-ignore because this is an artifact
// eslint-disable-next-line import/no-unresolved
import components from '../../../playground/fixtures.json';
import { vit } from '@tdd-buffet/visual';
import { describe } from 'tdd-buffet/suite/gui';
import { loadFixture } from '../load-fixture';

// Some components might render things like portals which need to be handled
// differently.
const componentSelectors: {[componentName: string]: string} = {
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

  const selector = componentSelectors[componentName] || '#root > *';

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
