import Commits, { CommitsProps } from '../../../src/components/commits';
import Commit from '../../../src/components/commit';
import createBranch from '../../factories/commits';

const master = createBranch(3);

const props: CommitsProps = {
  Commit,
  commits: {
    state: {
      master,
      branches: [],
      detached: false,
      head: master[master.length - 1].id
    },
    reset: () => {}
  }
};

export default {
  component: Commits,
  props
};
