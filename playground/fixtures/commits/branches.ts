import Commits, { CommitsProps } from '../../../src/components/commits';
import Commit from '../../../src/components/commit';
import createBranch from '../../factories/commits';

const activeBranch = createBranch(3);

const props: CommitsProps = {
  Commit,
  commits: {
    state: {
      master: [],
      branches: [
        createBranch(5),
        activeBranch
      ],
      detached: true,
      head: activeBranch[activeBranch.length - 1].id
    },
    reset: () => {}
  }
};

export default {
  component: Commits,
  props
};
