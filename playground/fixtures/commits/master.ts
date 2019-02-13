import Commits, { CommitsProps } from '../../../src/components/commits';
import { StateCommit } from '../../../src/commits-container';
import Commit from '../../../src/components/commit';

const commit1: StateCommit = {
  id: 1,
  state: { foo: 'bar' },
  checkout: () => {},
  parent: null,
  instance: { state: { foo: 'bar' } }
};
const commit2: StateCommit = {
  id: 2,
  state: { foo: 'baz' },
  checkout: () => {},
  parent: commit1,
  instance: { state: { foo: 'baz' } }
};
const commit3: StateCommit = {
  id: 3,
  state: { foo: 'gaga' },
  checkout: () => {},
  parent: commit2,
  instance: { state: { foo: 'gaga' } }
};

const props: CommitsProps = {
  Commit,
  commits: {
    state: {
      master: [commit1, commit2, commit3],
      branches: [],
      detached: false,
      head: commit3.id
    },
    reset: () => {}
  }
};

export default {
  component: Commits,
  props
};
