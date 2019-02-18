import CommitGraphDebugView, { CommitGraphProps } from '../../../src/components/commit-graph-debug';
import Commit from '../../../src/components/commit';
import createBranch from '../../factories/commit';
import bindComponent from 'react-bind-component';
import Tooltip from '@material-ui/core/Tooltip';

const master = createBranch(3);

const props: CommitGraphProps = {
  Commit: bindComponent(Commit, { Tooltip }),
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
