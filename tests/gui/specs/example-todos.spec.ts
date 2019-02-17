import { describe, loadFixture, it, beforeEach, expect } from '../suite';

describe('Example:Todos', () => {
  beforeEach(async () => {
    await loadFixture('ReplayableTodos', 'todos');
  });

  it('should record a commit for every key press', async browser => {
    const newTodo = 'buy milk';
    await browser.setValue('input', newTodo);

    const { value: commits } = await browser.elements('.commit-node');
    expect(commits).to.have.length(newTodo.length);
  });

  it('should record a commit for adding a todo', async browser => {
    await browser.setValue('input', 'x');
    await browser.click('button');

    const { value: commits } = await browser.elements('.commit-node');
    expect(commits).to.have.length(2);
  });

  it('should revert key presses', async browser => {
    await browser.setValue('input', 'buy milk');

    await browser.click('.commit:first-child');

    expect(await browser.getValue('input')).to.equal('b');
  });

  it('should revert adding todos', async browser => {
    await browser.setValue('input', 'x');
    await browser.click('button');

    await browser.click('.commit:first-child');

    expect(await browser.getText('#todos')).to.be.empty;
  });
});
