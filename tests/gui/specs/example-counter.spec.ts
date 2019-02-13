import { describe, loadFixture, vit, beforeEach } from '../suite';

describe('Example:Counter', () => {
  beforeEach(async () => {
    await loadFixture('ReplayableCounter', 'counter');
  });

  vit('should start recording commits', async browser => {
    await browser.click('button');
    await browser.click('button');
    await browser.click('button');
  });

  vit('should go back in time', async browser => {
    await browser.click('button');
    await browser.click('button');
    await browser.click('button');

    await browser.click('.commit:first-child');
  });
});
