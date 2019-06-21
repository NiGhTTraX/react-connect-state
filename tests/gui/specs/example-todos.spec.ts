import { describe, loadFixture, it, beforeEach, expect } from '../suite';

describe('Example:Todos', () => {
  beforeEach(async () => {
    await loadFixture('ReplayableTodos', 'todos');
  });

  it('should record a commit for every key press', async browser => {
    const newTodo = 'buy milk';
    const input = await browser.$('input');
    await input.setValue(newTodo);

    const commits = await browser.$$('.commit-node');
    expect(commits).to.have.length(newTodo.length);
  });

  it('should record a commit for adding a todo', async browser => {
    const input = await browser.$('input');
    await input.setValue('x');

    const button = await browser.$('button');
    await button.click();

    const commits = await browser.$$('.commit-node');
    expect(commits).to.have.length(2);
  });

  it('should revert key presses', async browser => {
    let input = await browser.$('input');
    await input.setValue('buy milk');

    const firstCommit = await browser.$('.commit:first-child');
    firstCommit.click();

    input = await browser.$('input');
    expect(await input.getValue()).to.equal('b');
  });

  it('should revert adding todos', async browser => {
    const input = await browser.$('input');
    await input.setValue('x');

    const button = await browser.$('button');
    await button.click();

    const firstCommit = await browser.$('.commit:first-child');
    firstCommit.click();

    const todos = await browser.$('#todos');
    expect(await todos.getText()).to.be.empty;
  });
});
