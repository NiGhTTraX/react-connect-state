/* eslint-disable react/no-access-state-in-setstate */
import { spy } from 'sinon';
import { beforeEach, describe, expect, it } from './suite';
import StateContainer from '../../src/state-container';
import commitsContainer, { TimelineState, StateCommit } from '../../src/commits-container';

describe('commitsContainer', () => {
  const commitListener = spy();
  const getLastUpdate: () => TimelineState = () => commitListener.lastCall.args[0];

  beforeEach(() => {
    commitsContainer.reset();
    commitListener.resetHistory();

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

    let states = getLastUpdate().master.map((c: StateCommit) => c.state);
    expect(states).to.deep.equal([
      { count: 1 }
    ]);

    container2.doStuff();

    states = getLastUpdate().master.map((c: StateCommit) => c.state);
    expect(states).to.deep.equal([
      { count: 1 },
      { count: 2 }
    ]);
  });

  it('should allow a previous state to be checked out', () => {
    const container = new CounterContainer();
    container.increment();
    container.increment();

    const firstCommit = getLastUpdate().master[0];
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

    const commit: StateCommit = getLastUpdate().master[2];
    commit.checkout();

    expect(container1.state.count).to.equal(3);
    expect(container2.state.count).to.equal(2);
  });

  it('should not commit a checkout', () => {
    const container = new CounterContainer();
    container.increment();
    container.increment();

    const firstCommit = getLastUpdate().master[0];

    commitListener.resetHistory();
    firstCommit.checkout();

    expect(getLastUpdate().master).to.have.length(2);
  });

  it('after a checkout it should record new commits in a new branch', () => {
    const container = new CounterContainer();
    container.increment();
    container.increment();

    const firstCommit: StateCommit = getLastUpdate().master[0];

    commitListener.resetHistory();

    firstCommit.checkout();

    expect(container.state.count).to.equal(2);
    container.increment();
    expect(container.state.count).to.equal(3);

    const lastUpdate = getLastUpdate();

    expect(lastUpdate.master).to.have.length(2);
    expect(lastUpdate.branches).to.have.length(1);
    expect(lastUpdate.branches[0][0].state).to.deep.equal({ count: 3 });
  });

  it('should update the head when checking out', () => {
    const container = new CounterContainer();
    container.increment();
    container.increment();

    const firstCommit: StateCommit = getLastUpdate().master[0];
    firstCommit.checkout();

    expect(getLastUpdate().head).to.equal(firstCommit.id);
  });

  it('should not replay the entire commit range when checking out an early commit');

  it('should handle checkout out different branches while on them and while not');

  it('should make commits immutable');
});