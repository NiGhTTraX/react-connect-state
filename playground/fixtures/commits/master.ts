import Commits, { CommitsProps } from '../../../src/components/commits';
import Commit from '../../../src/components/commit';
import createBranch from '../../factories/commits';

const master = createBranch(3);

const props: CommitsProps = {
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
  component: Commits,
  props
};
