/* eslint-disable react/no-access-state-in-setstate */
import { spy } from 'sinon';
import StateContainer from '../../src/state-container';
import { CommitGraphState, StateCommit } from '../../src/commit-graph';
import { stateCommitGraph } from '../../src';
import { beforeEach, describe, it } from 'tdd-buffet/suite/node';
import { expect } from '../expect';

describe('stateCommitGraph', () => {
  const commitListener = spy();
  const getLastUpdate: () => CommitGraphState = () => commitListener.lastCall.args[0];

  interface CountState {
    count: number;
  }

  class CounterContainer extends StateContainer<CountState> {
    state = { count: 1 };

    increment() {
      this.setState({ count: this.state.count + 1 });
    }
  }

  beforeEach(() => {
    stateCommitGraph.reset();
    commitListener.resetHistory();

    stateCommitGraph.subscribe(commitListener);
  });

  it('should make a commit for every state update', () => {
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

    const container1 = new Container1();
    const container2 = new Container2();

    container1.doStuff();

    let states = getLastUpdate().branches[0].map((c: StateCommit) => c.state);
    expect(states).to.deep.equal([
      { count: 1 }
    ]);

    container2.doStuff();

    states = getLastUpdate().branches[0].map((c: StateCommit) => c.state);
    expect(states).to.deep.equal([
      { count: 1 },
      { count: 2 }
    ]);
  });

  it('should have a head pointing to the last commit', () => {
    const container = new CounterContainer();
    container.increment();
    container.increment();
    container.increment();

    const lastUpdate = getLastUpdate();
    expect(lastUpdate.head).to.equal(lastUpdate.branches[0][2]);
  });

  it('should link the commits', () => {
    const container = new CounterContainer();
    container.increment();
    container.increment();
    container.increment();

    const lastUpdate = getLastUpdate();
    expect(lastUpdate.branches[0][2].parent).to.equal(lastUpdate.branches[0][1]);
    expect(lastUpdate.branches[0][1].parent).to.equal(lastUpdate.branches[0][0]);
  });

  it('should make commits referentially comparable', () => {
    const container = new CounterContainer();
    container.increment();

    const commit = getLastUpdate().branches[0][0];

    container.increment();

    expect(getLastUpdate().branches[0][0]).to.equal(commit);
  });

  it('should update the active branch when checking out', () => {
    const container = new CounterContainer();
    container.increment();
    container.increment();

    getLastUpdate().branches[0][0].checkout();

    container.increment();

    getLastUpdate().branches[0][0].checkout();

    expect(getLastUpdate().activeBranch).to.equal(0);
  });

  describe('checking out', () => {
    it('should allow a previous state to be checked out', () => {
      const container = new CounterContainer();
      container.increment();
      container.increment();

      const firstCommit = getLastUpdate().branches[0][0];
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

      const commit: StateCommit = getLastUpdate().branches[0][2];
      commit.checkout();

      expect(container1.state.count).to.equal(3);
      expect(container2.state.count).to.equal(2);
    });

    it('should not commit a checkout', () => {
      const container = new CounterContainer();
      container.increment();
      container.increment();

      const firstCommit = getLastUpdate().branches[0][0];

      commitListener.resetHistory();
      firstCommit.checkout();

      expect(getLastUpdate().branches[0]).to.have.length(2);
    });

    it('should not replay the entire commit range when checking out an early commit', () => {
      const container = new CounterContainer();
      container.increment();
      container.increment();
      container.increment();

      const listener = spy();
      container.subscribe(listener);

      getLastUpdate().branches[0][0].checkout();

      expect(listener).to.have.been.calledOnce;
    });

    it('should update the head when checking out', () => {
      const container = new CounterContainer();
      container.increment();
      container.increment();

      const firstCommit: StateCommit = getLastUpdate().branches[0][0];
      firstCommit.checkout();

      expect(getLastUpdate().head).to.equal(firstCommit);
    });

    it('should continue the active branch if checking out the head', () => {
      const container = new CounterContainer();
      container.increment();
      container.increment();

      getLastUpdate().branches[0][0].checkout();
      getLastUpdate().branches[0][1].checkout();

      container.increment();

      expect(getLastUpdate().branches).to.have.length(1);
      expect(getLastUpdate().branches[0]).to.have.length(3);
    });
  });

  describe('branching', () => {
    it('after a checkout it should record new commits in a new branch', () => {
      const container = new CounterContainer();
      container.increment();
      container.increment();

      const firstCommit: StateCommit = getLastUpdate().branches[0][0];

      commitListener.resetHistory();

      firstCommit.checkout();

      expect(container.state.count).to.equal(2);
      container.increment();
      expect(container.state.count).to.equal(3);

      const lastUpdate = getLastUpdate();

      expect(lastUpdate.branches).to.have.length(2);
      expect(lastUpdate.branches[1][0].state).to.deep.equal({ count: 3 });
    });

    it('should create a new branch from the currently checked out commit', () => {
      const container = new CounterContainer();
      container.increment();
      container.increment();

      getLastUpdate().branches[0][0].checkout();
      container.increment();

      const lastUpdate = getLastUpdate();
      expect(lastUpdate.branches[1][0].parent).to.equal(lastUpdate.branches[0][0]);
    });

    it('should update the active branch when checking out the first commit of a diff branch', () => {
      const container = new CounterContainer();
      container.increment();
      container.increment();

      getLastUpdate().branches[0][0].checkout();

      container.increment();

      getLastUpdate().branches[0][0].checkout();
      getLastUpdate().branches[1][0].checkout();

      expect(getLastUpdate().activeBranch).to.equal(1);
    });

    it('should update the active branch when creating a new branch while on an early branch', () => {
      const container = new CounterContainer();
      container.increment();
      container.increment();
      getLastUpdate().branches[0][0].checkout();

      container.increment();
      container.increment();
      getLastUpdate().branches[0][0].checkout();

      container.increment();

      expect(getLastUpdate().activeBranch).to.equal(2);
    });
  });
});
