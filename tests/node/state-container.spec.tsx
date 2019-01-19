/* eslint-disable react/no-access-state-in-setstate */
import { spy } from 'sinon';
import { describe, it, expect } from './suite';
import StateContainer, {
  commitsContainer,
  CommitsState,
  StateCommit
} from '../../src/state-container';

describe('StateContainer', () => {
  interface FooState {
    // eslint-disable-next-line no-use-before-define
    foo: number;
  }

  class Foo extends StateContainer<FooState> {
    increment() {
      this.setState({ foo: 42 });
    }
  }

  it('should call when the state is updated', () => {
    const listener = spy();

    const foo = new Foo();
    foo.addListener(listener);
    foo.increment();

    expect(listener).to.have.been.calledOnceWith({ foo: 42 });
  });

  it('should call all its listeners when the state is updated', () => {
    const listener1 = spy();
    const listener2 = spy();

    const foo = new Foo();
    foo.addListener(listener1);
    foo.addListener(listener2);
    foo.increment();

    expect(listener1).to.have.been.calledOnceWith({ foo: 42 });
    expect(listener2).to.have.been.calledOnceWith({ foo: 42 });
  });

  describe('commitsContainer', () => {
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
      commitsContainer.reset();
      const listener = spy();
      commitsContainer.addListener(listener);

      const container1 = new Container1();
      const container2 = new Container2();

      container1.doStuff();

      let states = listener.lastCall.args[0].commits.map((c: StateCommit) => c.state);
      expect(states).to.deep.equal([
        { count: 1 }
      ]);

      container2.doStuff();

      states = listener.lastCall.args[0].commits.map((c: StateCommit) => c.state);
      expect(states).to.deep.equal([
        { count: 1 },
        { count: 2 }
      ]);
    });

    it('should allow a previous state to be checked out', () => {
      commitsContainer.reset();
      const listener = spy();
      commitsContainer.addListener(listener);

      const container = new CounterContainer();
      container.increment();
      container.increment();

      const firstUpdate: CommitsState = listener.firstCall.args[0];
      const firstCommit: StateCommit = firstUpdate.commits[0];

      firstCommit.checkout();

      expect(container.state.count).to.equal(2);
    });

    it('should not commit a rollback', () => {
      commitsContainer.reset();
      const listener = spy();
      commitsContainer.addListener(listener);

      const container = new CounterContainer();
      container.increment();
      container.increment();

      const firstUpdate: CommitsState = listener.firstCall.args[0];
      const firstCommit: StateCommit = firstUpdate.commits[0];

      listener.resetHistory();
      firstCommit.checkout();

      expect(listener).to.not.have.been.called;
    });
  });
});
