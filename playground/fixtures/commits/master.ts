import Commits, { CommitsProps } from '../../../src/components/commits';
import { StateCommit } from '../../../src/commits-container';

const commit1: StateCommit = {
  id: 1,
  state: { foo: 'bar' },
  checkout: () => {},
  next: null,
  prev: null,
  instance: { state: { foo: 'bar' } }
};
const commit2: StateCommit = {
  id: 2,
  state: { foo: 'baz' },
  checkout: () => {},
  next: null,
  prev: commit1,
  instance: { state: { foo: 'baz' } }
};
const commit3: StateCommit = {
  id: 3,
  state: { foo: 'gaga' },
  checkout: () => {},
  next: null,
  prev: commit2,
  instance: { state: { foo: 'gaga' } }
};
commit1.next = commit2;
commit2.next = commit3;

const props: CommitsProps = {
  commits: {
    state: {
      master: [commit1, commit2, commit3],
      branches: [],
      detached: false
    },
    reset: () => {}
  }
};

export default {
  component: Commits,
  props
};
