import CommitGraphDebugView from '../../../src/components/commit-graph-debug';
import Commit from '../../../src/components/commit';
import createBranch from '../../factories/commit';
import bindComponent from 'react-bind-component';
import Tooltip from '@material-ui/core/Tooltip';
import createFixture from '../../fixture-helper';

const master = createBranch(3);

export default createFixture(CommitGraphDebugView, {
  Commit: bindComponent(Commit, { Tooltip }),
  commitGraph: {
    state: {
      branches: [master],
      activeBranch: 0,
      head: master[master.length - 1]
    },
    reset: () => {
    }
  }
});
