import { describe, loadFixture, beforeEach, vit } from '../suite';

describe('Commit', () => {
  beforeEach(async () => {
    await loadFixture('Commit', 'big-state');
  });

  vit('hover', async browser => {
    await browser.moveToObject('.commit');
  }, '#root');
});
