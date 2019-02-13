import React from 'react';
import { $render, describe, expect, it } from '../suite';
import Commits from '../../../src/components/commits';
import { ICommitsContainer, StateCommit } from '../../../src/commits-container';

describe('Commits', () => {
  const commit1: StateCommit = {
    state: { foo: 'bar' },
    checkout: () => {},
    next: null,
    prev: null,
    instance: { state: { foo: 'bar' } }
  };
  const commit2: StateCommit = {
    state: { foo: 'baz' },
    checkout: () => {},
    next: null,
    prev: commit1,
    instance: { state: { foo: 'baz' } }
  };
  const commit3: StateCommit = {
    state: { foo: 'gaga' },
    checkout: () => {},
    next: null,
    prev: commit2,
    instance: { state: { foo: 'gaga' } }
  };
  commit1.next = commit2;
  commit2.next = commit3;

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
