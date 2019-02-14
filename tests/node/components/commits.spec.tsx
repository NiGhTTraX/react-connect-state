import React from 'react';
import { createReactStub } from 'react-mock-component';
import { $render, describe, expect, it } from '../suite';
import Commits, { CommitProps } from '../../../src/components/commits';
import { ICommitsContainer, StateCommit } from '../../../src/commits-container';
import { Simulate } from 'react-dom/test-utils';

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

  let commits!: ICommitsContainer;

  describe('master', () => {
    beforeEach(() => {
      commits = {
        state: {
          master: [commit1, commit2, commit3],
          branches: [],
          detached: false,
          head: commit3.id
        },
        reset: () => {}
      };
    });

    it('should render all the commits', () => {
      const Commit = createReactStub<CommitProps>();

      $render(<Commits Commit={Commit} commits={commits} />);

      expect(Commit.renderedWith({ commit: commit1 })).to.be.true;
      expect(Commit.renderedWith({ commit: commit2 })).to.be.true;
      expect(Commit.renderedWith({ commit: commit3 })).to.be.true;
    });

    it('should mark commits after a checkout', () => {
      commits.state.head = commit2.id;

      const Commit = createReactStub<CommitProps>();

      $render(<Commits Commit={Commit} commits={commits} />);

      expect(Commit.renderedWith({ commit: commit1, disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: commit2, disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: commit3, disabled: true })).to.be.true;
    });

    it('should preview a checkout on mouse over', () => {
      const Commit = createReactStub<CommitProps>();

      const $commits = $render(<Commits Commit={Commit} commits={commits} />);

      Commit.sinonStub.resetHistory();
      Simulate.mouseOver($commits.find('.commit-node')[1]);

      expect(Commit.renderedWith({ commit: commit1, disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: commit2, disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: commit3, disabled: true })).to.be.true;
    });

    it('should stop previewing a checkout on mouse leave', () => {
      const Commit = createReactStub<CommitProps>();

      const $commits = $render(<Commits Commit={Commit} commits={commits} />);

      Simulate.mouseOver($commits.find('.commit-node')[1]);
      Commit.sinonStub.resetHistory();
      Simulate.mouseLeave($commits.find('.commit-node')[1]);

      expect(Commit.renderedWith({ commit: commit1, disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: commit2, disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: commit3, disabled: false })).to.be.true;
    });

    it('should preview a later checkout', () => {
      commits.state.head = commit1.id;

      const Commit = createReactStub<CommitProps>();

      const $commits = $render(<Commits Commit={Commit} commits={commits} />);

      Simulate.mouseOver($commits.find('.commit-node')[1]);

      expect(Commit.renderedWith({ commit: commit1, disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: commit2, disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: commit3, disabled: true })).to.be.true;
    });
  });
});
