import enabled from './enabled';
import { CommitProps } from '../../../src/components/commits';

const props:CommitProps = {
  ...enabled.props,
  disabled: true
};

export default {
  ...enabled,
  props
};
