import { describe, loadFixture, beforeEach, vit } from '../suite';

describe('Commit', () => {
  beforeEach(async () => {
    await loadFixture('Commit', 'enabled');
  });

  vit('hover', async browser => {
    await browser.moveToObject('.commit');
  }, '#root');
});
