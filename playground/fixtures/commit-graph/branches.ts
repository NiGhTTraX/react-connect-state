/* eslint-disable prefer-destructuring */
import CommitGraph, { CommitGraphProps } from '../../../src/components/commit-graph';
import Commit from '../../../src/components/commit';
import createBranch from '../../factories/commit';

const masterBranch = createBranch(5);
const activeBranch = createBranch(4);
const inactiveBranch = createBranch(7);
const anotherInactiveBranch = createBranch(2);

activeBranch[0].parent = masterBranch[2];
inactiveBranch[0].parent = masterBranch[1];
anotherInactiveBranch[0].parent = activeBranch[3];

const props: CommitGraphProps = {
  Commit,
  commitGraph: {
    state: {
      branches: [
        masterBranch,
        activeBranch,
        inactiveBranch,
        anotherInactiveBranch
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
