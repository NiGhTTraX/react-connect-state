import { StateCommit } from '../../src/commit-graph';

let id = 1;

export default function createBranch(num: number): StateCommit[] {
  const commit: StateCommit = {
    id,
    state: { foo: 'bar' },
    checkout: () => {},
    parent: null,
    instance: { state: { foo: 'bar' } }
  };
  const commits: StateCommit[] = [];

  for (let i = 0; i < num; i++) {
    const newCommit = { ...commit, id: ++id };

    if (i > 1) {
      newCommit.parent = commits[i - 1];
    }

    commits.push(newCommit);
  }

  return commits;
}
