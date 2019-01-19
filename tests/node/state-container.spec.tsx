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
    it('should call a global listener for every state update', () => {
      class Container1 extends StateContainer<FooState> {
        doStuff() {
          this.setState({ foo: 1 });
        }
      }

      class Container2 extends StateContainer<FooState> {
        doStuff() {
          this.setState({ foo: 2 });
        }
      }

      commitsContainer.reset();
      const listener = spy();
      commitsContainer.addListener(listener);

      const container1 = new Container1();
      const container2 = new Container2();

      container1.doStuff();

      let states = listener.lastCall.args[0].commits.map((c: StateCommit) => c.state);
      expect(states).to.deep.equal([
        { foo: 1 }
      ]);

      container2.doStuff();

      states = listener.lastCall.args[0].commits.map((c: StateCommit) => c.state);
      expect(states).to.deep.equal([
        { foo: 1 },
        { foo: 2 }
      ]);
    });

    it('should allow a previous state to be rolled back', () => {
      class Container extends StateContainer<FooState> {
        state = { foo: 1 };

        increment() {
          this.setState({ foo: this.state.foo + 1 });
        }
      }

      commitsContainer.reset();
      const listener = spy();
      commitsContainer.addListener(listener);

      const container = new Container();
      container.increment();
      container.increment();

      const firstUpdate: CommitsState = listener.firstCall.args[0];
      const firstCommit: StateCommit = firstUpdate.commits[0];

      listener.resetHistory();
      firstCommit.commit();

      expect(container.state.foo).to.equal(2);

      // TODO: the rollback will be committed, is this desired?
      expect(listener.lastCall.args[0].commits).to.not.be.empty;
    });
  });
});
