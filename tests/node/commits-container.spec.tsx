/* eslint-disable react/no-access-state-in-setstate */
import { SinonSpy, spy } from 'sinon';
import { describe, it, beforeEach, expect } from './suite';
import StateContainer from '../../src/state-container';
import commitsContainer, { CommitsState, StateCommit } from '../../src/commits-container';

describe('commitsContainer', () => {
  let commitListener: SinonSpy;

  beforeEach(() => {
    commitsContainer.reset();

    commitListener = spy();
    commitsContainer.addListener(commitListener);
  });

  interface CountState {
    count: number;
  }

  class Container1 extends StateContainer<CountState> {
    doStuff() {
      this.setState({ count: 1 });
    }
  }

  class Container2 extends StateContainer<CountState> {
    doStuff() {
      this.setState({ count: 2 });
    }
  }

  class CounterContainer extends StateContainer<CountState> {
    state = { count: 1 };

    increment() {
      this.setState({ count: this.state.count + 1 });
    }
  }

  it('should call a global listener for every state update', () => {
    const container1 = new Container1();
    const container2 = new Container2();

    container1.doStuff();

    let states = commitListener.lastCall.args[0].master.map((c: StateCommit) => c.state);
    expect(states).to.deep.equal([
      { count: 1 }
    ]);

    container2.doStuff();

    states = commitListener.lastCall.args[0].master.map((c: StateCommit) => c.state);
    expect(states).to.deep.equal([
      { count: 1 },
      { count: 2 }
    ]);
  });

  it('should allow a previous state to be checked out', () => {
    const container = new CounterContainer();
    container.increment();
    container.increment();

    const lastUpdate: CommitsState = commitListener.lastCall.args[0];
    const firstCommit: StateCommit = lastUpdate.master[0];

    firstCommit.checkout();

    expect(container.state.count).to.equal(2);
  });

  it('should checkout a whole range across containers', () => {
    const container1 = new CounterContainer();
    const container2 = new CounterContainer();

    container1.increment();
    container2.increment();
    container1.increment();
    container2.increment();
    container1.increment();
    container2.increment();

    const lastUpdate: CommitsState = commitListener.lastCall.args[0];
    const commit: StateCommit = lastUpdate.master[2];

    commit.checkout();

    expect(container1.state.count).to.equal(3);
    expect(container2.state.count).to.equal(2);
  });

  it('should not commit a checkout', () => {
    const container = new CounterContainer();
    container.increment();
    container.increment();

    const firstUpdate: CommitsState = commitListener.firstCall.args[0];
    const firstCommit: StateCommit = firstUpdate.master[0];

    commitListener.resetHistory();
    firstCommit.checkout();

    expect(commitListener.lastCall.args[0].master).to.have.length(2);
  });

  it('after a checkout it should record new commits in a new branch', () => {
    const container = new CounterContainer();
    container.increment();
    container.increment();

    const firstUpdate: CommitsState = commitListener.firstCall.args[0];
    const firstCommit: StateCommit = firstUpdate.master[0];

    commitListener.resetHistory();

    firstCommit.checkout();

    expect(container.state.count).to.equal(2);
    container.increment();
    expect(container.state.count).to.equal(3);

    const lastUpdate: CommitsState = commitListener.lastCall.args[0];

    expect(lastUpdate.master).to.have.length(2);
    expect(lastUpdate.branches).to.have.length(1);
    expect(lastUpdate.branches[0][0].state).to.deep.equal({ count: 3 });
  });
});
