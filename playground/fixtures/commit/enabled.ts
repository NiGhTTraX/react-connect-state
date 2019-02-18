// eslint-disable-next-line no-unused-vars
import { Component } from 'react';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import Commit from '../../../src/components/commit';

// TODO: extract helper for inferring the type
const props: Commit extends Component<infer T> ? T : never = {
  Tooltip,
  commit: {
    id: 1,
    parent: null,
    checkout: () => {},
    state: { foo: 'bar' },
    instance: { state: { foo: 'bar' } }
  }
};

export default {
  component: Commit,
  props
};
