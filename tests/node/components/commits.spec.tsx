import React from 'react';
import { createReactStub } from 'react-mock-component';
import { $render, describe, expect, it } from '../suite';
import Commits, { CommitProps } from '../../../src/components/commits';
import { ICommitsContainer, StateCommit } from '../../../src/commits-container';

describe('Commits', () => {
  describe('master', () => {
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

    it('should render all the commits', () => {
      const commits: ICommitsContainer = {
        state: {
          master: [commit1, commit2, commit3],
          branches: [],
          detached: false,
          head: commit3.id
        },
        reset: () => {}
      };

      const Commit = createReactStub<CommitProps>();

      $render(<Commits
        Commit={Commit}
        commits={commits}
      />);

      expect(Commit.renderedWith({ commit: commit1 })).to.be.true;
      expect(Commit.renderedWith({ commit: commit2 })).to.be.true;
      expect(Commit.renderedWith({ commit: commit3 })).to.be.true;
    });

    it('should mark commits after a checkout', () => {
      const commits: ICommitsContainer = {
        state: {
          master: [commit1, commit2, commit3],
          branches: [],
          detached: false,
          head: commit2.id
        },
        reset: () => {}
      };

      const Commit = createReactStub<CommitProps>();

      $render(<Commits
        Commit={Commit}
        commits={commits}
      />);

      expect(Commit.renderedWith({ commit: commit1, disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: commit2, disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: commit3, disabled: true })).to.be.true;
    });
  });
});
