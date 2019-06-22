import { describe, loadFixture, beforeEach, vit } from '../suite';

describe('Commit', () => {
  beforeEach(async () => {
    await loadFixture('Commit', 'big-state');
  });

  vit('hover', async browser => {
    const commit = await browser.$('.commit');
    await commit.moveTo();
  }, '#root');
});
