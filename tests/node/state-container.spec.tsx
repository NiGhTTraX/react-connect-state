import { describe, it } from './suite';
import StateContainer from '../../src/state-container';
import { Mock } from 'typemoq';

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

    const onStateUpdate = Mock.ofType<() => void>();
    onStateUpdate.setup(x => x()).verifiable();

    const foo = new Foo();
    foo.addListener(onStateUpdate.object);
    foo.increment();

    onStateUpdate.verifyAll();
  });
});
