import CommitGraphDebugView, { CommitGraphProps } from '../../../src/components/commit-graph-debug';
import Commit from '../../../src/components/commit';
import createBranch from '../../factories/commit';

const master = createBranch(3);

const props: CommitGraphProps = {
  Commit,
  commitGraph: {
    state: {
      branches: [master],
      activeBranch: 0,
      head: master[master.length - 1]
    },
    reset: () => {}
  }
};

export default {
  component: CommitGraphDebugView,
  props
};
