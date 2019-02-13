import React from 'react';
import { $render, describe, expect, it } from '../suite';
import Commits from '../../../src/components/commits';
import { ICommitsContainer, StateCommit } from '../../../src/commits-container';

describe('Commits', () => {
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

  it('should render all the master commits', () => {
    const commits: ICommitsContainer = {
      state: {
        master: [commit1, commit2, commit3],
        branches: [],
        detached: false
      },
      reset: () => {}
    };

    const $commits = $render(<Commits commits={commits} />);

    expect($commits.find('.master .commit')).to.have.length(3);
  });
});
