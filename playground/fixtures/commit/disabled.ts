import enabled from './enabled';
import { CommitProps } from '../../../src/components/commit-graph';

const props:CommitProps = {
  ...enabled.props,
  disabled: true
};

export default {
  ...enabled,
  props
};
