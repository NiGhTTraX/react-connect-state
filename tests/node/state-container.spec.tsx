import { spy } from 'sinon';
import { describe, it, expect } from './suite';
import StateContainer, { commitsContainer } from '../../src/state-container';

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

  it('should call a global singleton for every state update', () => {
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
    expect(listener).to.have.been.calledWith({
      commits: [
        { state: { foo: 1 } }
      ]
    });

    container2.doStuff();
    expect(listener).to.have.been.calledWith({
      commits: [
        { state: { foo: 1 } },
        { state: { foo: 2 } }
      ]
    });
  });
});
