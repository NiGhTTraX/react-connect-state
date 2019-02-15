import CommitGraph, { CommitGraphProps } from '../../../src/components/commit-graph';
import Commit from '../../../src/components/commit';
import createBranch from '../../factories/commit';

const master = createBranch(3);

const props: CommitGraphProps = {
  Commit,
  commits: {
    state: {
      branches: [master],
      activeBranch: 0,
      head: master[master.length - 1]
    },
    reset: () => {}
  }
};

export default {
  component: CommitGraph,
  props
};
