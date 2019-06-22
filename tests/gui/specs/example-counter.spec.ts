import { describe, loadFixture, it, beforeEach, expect } from '../suite';

describe('Example:Counter', () => {
  beforeEach(async () => {
    await loadFixture('ReplayableCounter', 'counter');
  });

  it('should start recording commits', async browser => {
    const button = await browser.$('button');
    await button.click();
    await button.click();
    await button.click();

    const commits = await browser.$$('.commit-node');
    expect(commits).to.have.length(3);
  });

  it('should go back in time', async browser => {
    const button = await browser.$('button');
    await button.click();
    await button.click();
    await button.click();

    const firstCommit = await browser.$('.commit:first-child');
    await firstCommit.click();

    const count = await browser.$('#count');
    expect(await count.getText()).to.equal('2');
  });

  it('should create new branches', async browser => {
    const button = await browser.$('button');
    await button.click();
    await button.click();
    await button.click();

    const firstCommit = await browser.$('.commit:first-child');
    await firstCommit.click();

    await button.click();
    await button.click();

    const count = await browser.$('#count');
    expect(await count.getText()).to.equal('4');
  });

  it('should switch between branches', async browser => {
    const button = await browser.$('button');
    await button.click();
    await button.click();
    await button.click();

    const firstCommit = await browser.$('.commit:first-child');
    await firstCommit.click();

    await button.click();
    await button.click();
    await button.click();

    await firstCommit.click();

    const count = await browser.$('#count');
    expect(await count.getText()).to.equal('2');
  });
});
