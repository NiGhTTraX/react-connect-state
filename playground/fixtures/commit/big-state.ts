import enabled from './enabled';
import { extendFixture } from '../../fixture-helper';

const complexState = {
  foo: 'bar',
  toggled: false,
  pretty: true,
  count: 42,
  arr: [1, 2, 3],
  nested: {
    hello: 'world'
  }
};

export default extendFixture(enabled, {
  commit: {
    ...enabled.props.commit,
    state: complexState,
    instance: { state: complexState }
  }
});
