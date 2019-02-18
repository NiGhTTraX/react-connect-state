// eslint-disable-next-line no-unused-vars
import { Component } from 'react';
import enabled from './enabled';
// eslint-disable-next-line no-unused-vars
import Commit from '../../../src/components/commit';

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

const props: Commit extends Component<infer T> ? T : never = {
  ...enabled.props,
  commit: {
    ...enabled.props.commit,
    state: complexState,
    instance: { state: complexState }
  }
};

export default {
  ...enabled,
  props
};
