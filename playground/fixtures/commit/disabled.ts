/* eslint-disable no-unused-vars */
import { Component } from 'react';
import enabled from './enabled';
import Commit from '../../../src/components/commit';

const props: Commit extends Component<infer T> ? T : never = {
  ...enabled.props,
  disabled: true
};

export default {
  ...enabled,
  props
};
