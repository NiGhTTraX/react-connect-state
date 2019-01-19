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

    let states = commitListener.lastCall.args[0].commits.map((c: StateCommit) => c.state);
    expect(states).to.deep.equal([
      { count: 1 }
    ]);

    container2.doStuff();

    states = commitListener.lastCall.args[0].commits.map((c: StateCommit) => c.state);
    expect(states).to.deep.equal([
      { count: 1 },
      { count: 2 }
    ]);
  });

  it('should allow a previous state to be checked out', () => {
    const container = new CounterContainer();
    container.increment();
    container.increment();

    const firstUpdate: CommitsState = commitListener.firstCall.args[0];
    const firstCommit: StateCommit = firstUpdate.commits[0];

    firstCommit.checkout();

    expect(container.state.count).to.equal(2);
  });

  it('should not commit a checkout', () => {
    const container = new CounterContainer();
    container.increment();

    const firstUpdate: CommitsState = commitListener.firstCall.args[0];
    const firstCommit: StateCommit = firstUpdate.commits[0];

    commitListener.resetHistory();
    firstCommit.checkout();

    expect(commitListener.lastCall.args[0].commits).to.have.length(1);
  });

  it('should not allow new commits after a checkout', () => {
    const container = new CounterContainer();
    container.increment();

    const firstUpdate: CommitsState = commitListener.firstCall.args[0];
    const firstCommit: StateCommit = firstUpdate.commits[0];

    commitListener.resetHistory();

    firstCommit.checkout();
    container.increment();

    expect(commitListener.lastCall.args[0].commits).to.have.length(1);
  });
});
