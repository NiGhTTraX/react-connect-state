import { spy } from 'sinon';
import { describe, it, expect } from './suite';
import StateContainer from '../../src/state-container';

describe('StateContainer', () => {
  interface FooState {
    // eslint-disable-next-line no-use-before-define
    foo: number;
  }

  class Foo extends StateContainer<FooState> {
    increment() {
      this.setState({ });
    }
  }

  it('should call when the state is updated', () => {
    const listener = spy();

    const foo = new Foo();
    foo.addListener(listener);
    foo.increment();

    expect(listener).to.have.been.calledOnce;
  });

  it('should call all its listeners when the state is updated', () => {
    const listener1 = spy();
    const listener2 = spy();

    const foo = new Foo();
    foo.addListener(listener1);
    foo.addListener(listener2);
    foo.increment();

    expect(listener1).to.have.been.calledOnce;
    expect(listener2).to.have.been.calledOnce;
  });
});
