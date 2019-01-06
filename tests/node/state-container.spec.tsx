import { spy } from 'sinon';
import { describe, it, expect } from './suite';
import StateContainer from '../../src/state-container';

describe('StateContainer', () => {
  it('should call when the state is updated', () => {
    interface FooState {
      // eslint-disable-next-line no-use-before-define
      foo: number;
    }

    class Foo extends StateContainer<FooState> {
      state = { foo: 1 };

      increment() {
        this.setState({ foo: 2 });
      }
    }

    const listener = spy();

    const foo = new Foo();
    foo.addListener(listener);
    foo.increment();

    expect(listener).to.have.been.calledOnce;
  });
});
