import CommitGraph, { CommitGraphProps } from '../../../src/components/commit-graph';
import Commit from '../../../src/components/commit';
import createBranch from '../../factories/commit';

const activeBranch = createBranch(3);

const props: CommitGraphProps = {
  Commit,
  commits: {
    state: {
      branches: [
        createBranch(5),
        activeBranch
      ],
      activeBranch: 1,
      head: activeBranch[activeBranch.length - 1]
    },
    reset: () => {}
  }
};

export default {
  component: CommitGraph,
  props
};
