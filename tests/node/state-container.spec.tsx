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

    const onStateUpdate = Mock.ofType<(state: FooState) => void>();
    onStateUpdate.setup(x => x({ foo: 2 })).verifiable();

    const foo = new Foo({ onStateUpdate: onStateUpdate.object });
    foo.increment();

    onStateUpdate.verifyAll();
  });
});
