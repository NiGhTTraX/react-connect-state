import { describe, loadFixture, it, beforeEach, expect } from '../suite';

describe('Example:Counter', () => {
  beforeEach(async () => {
    await loadFixture('ReplayableCounter', 'counter');
  });

  it('should start recording commits', async browser => {
    await browser.click('button');
    await browser.click('button');
    await browser.click('button');

    const { value: commits } = await browser.elements('.commit-node');
    expect(commits).to.have.length(3);
  });

  it('should go back in time', async browser => {
    await browser.click('button');
    await browser.click('button');
    await browser.click('button');

    await browser.click('.commit:first-child');

    expect(await browser.getText('#count')).to.equal('2');
  });

  it('should create new branches', async browser => {
    await browser.click('button');
    await browser.click('button');
    await browser.click('button');

    await browser.click('.commit:first-child');

    await browser.click('button');
    await browser.click('button');

    expect(await browser.getText('#count')).to.equal('4');
  });

  it('should switch between branches', async browser => {
    await browser.click('button');
    await browser.click('button');
    await browser.click('button');

    await browser.click('.commit:first-child');

    await browser.click('button');
    await browser.click('button');
    await browser.click('button');

    await browser.click('.commit:first-child');

    expect(await browser.getText('#count')).to.equal('2');
  });
});
