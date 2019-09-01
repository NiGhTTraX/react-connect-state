import { vit } from '@tdd-buffet/visual';
import { beforeEach, describe } from 'tdd-buffet/suite/gui';
import { loadFixture } from '../load-fixture';

describe('Commit', () => {
  beforeEach(async () => {
    await loadFixture('Commit', 'big-state');
  });

  vit('hover', async browser => {
    const commit = await browser.$('.commit');
    await commit.moveTo();
  }, '#root');
});
