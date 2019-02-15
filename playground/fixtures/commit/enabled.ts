import Commit from '../../../src/components/commit';
import { CommitProps } from '../../../src/components/commit-graph';

const props: CommitProps = {
  commit: {
    id: 1,
    parent: null,
    checkout: () => {},
    state: {},
    instance: { state: {} }
  }
};

export default {
  component: Commit,
  props
};
