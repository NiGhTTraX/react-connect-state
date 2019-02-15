/* eslint-disable prefer-destructuring */
import React from 'react';
import { createReactStub } from 'react-mock-component';
import { $render, describe, expect, it } from '../suite';
import CommitGraph, { CommitProps } from '../../../src/components/commit-graph';
import { ICommitGraphContainer } from '../../../src/commits-container';
import { Simulate } from 'react-dom/test-utils';
import createBranch from '../../../playground/factories/commit';

describe('CommitGraph', () => {
  let commits!: ICommitGraphContainer;

  describe('master', () => {
    const master = createBranch(3);

    beforeEach(() => {
      commits = {
        state: {
          branches: [master],
          activeBranch: 0,
          head: master[master.length - 1]
        },
        reset: () => {}
      };
    });

    it('should render all the commits', () => {
      const Commit = createReactStub<CommitProps>();

      $render(<CommitGraph Commit={Commit} commits={commits} />);

      expect(Commit.renderedWith({ commit: master[0] })).to.be.true;
      expect(Commit.renderedWith({ commit: master[1] })).to.be.true;
      expect(Commit.renderedWith({ commit: master[2] })).to.be.true;
    });

    it('should mark commits after a checkout', () => {
      commits.state.head = master[1];

      const Commit = createReactStub<CommitProps>();

      $render(<CommitGraph Commit={Commit} commits={commits} />);

      expect(Commit.renderedWith({ commit: master[0], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[1], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[2], disabled: true })).to.be.true;
    });

    it('should preview a checkout on mouse over', () => {
      const Commit = createReactStub<CommitProps>();

      const $commits = $render(<CommitGraph Commit={Commit} commits={commits} />);

      Commit.sinonStub.resetHistory();
      Simulate.mouseOver($commits.find('.commit-node')[1]);

      expect(Commit.renderedWith({ commit: master[0], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[1], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[2], disabled: true })).to.be.true;
    });

    it('should stop previewing a checkout on mouse leave', () => {
      const Commit = createReactStub<CommitProps>();

      const $commits = $render(<CommitGraph Commit={Commit} commits={commits} />);

      Simulate.mouseOver($commits.find('.commit-node')[1]);
      Commit.sinonStub.resetHistory();
      Simulate.mouseLeave($commits.find('.commit-node')[1]);

      expect(Commit.renderedWith({ commit: master[0], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[1], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[2], disabled: false })).to.be.true;
    });

    it('should preview a later checkout', () => {
      commits.state.head = master[0];

      const Commit = createReactStub<CommitProps>();

      const $commits = $render(<CommitGraph Commit={Commit} commits={commits} />);

      Simulate.mouseOver($commits.find('.commit-node')[1]);

      expect(Commit.renderedWith({ commit: master[0], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[1], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[2], disabled: true })).to.be.true;
    });
  });

  describe('branches', () => {
    const activeBranch = createBranch(2);

    beforeEach(() => {
      commits = {
        state: {
          branches: [
            createBranch(2),
            activeBranch
          ],
          activeBranch: 1,
          head: activeBranch[activeBranch.length - 1]
        },
        reset: () => {}
      };
    });

    it('should render all commits', () => {
      const Commit = createReactStub<CommitProps>();

      $render(<CommitGraph commits={commits} Commit={Commit} />);

      commits.state.branches.forEach(branch => {
        branch.forEach(commit => {
          expect(Commit.renderedWith({ commit })).to.be.true;
        });
      });
    });

    it('should not mark the inactive branches as checked out', () => {
      const Commit = createReactStub<CommitProps>();

      $render(<CommitGraph commits={commits} Commit={Commit} />);

      commits.state.branches[0].forEach(commit => {
        expect(Commit.renderedWith({ commit, disabled: false })).to.be.true;
      });
    });

    it('should preview the correct branch on hover', () => {
      const Commit = createReactStub<CommitProps>();

      const $commits = $render(<CommitGraph commits={commits} Commit={Commit} />);
      Commit.sinonStub.resetHistory();

      const $firstBranch = $commits.find('.branch').eq(0);
      Simulate.mouseOver($firstBranch.find('.commit-node')[0]);

      const firstBranch = commits.state.branches[0];

      expect(Commit.renderedWith({ commit: firstBranch[0], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: firstBranch[1], disabled: true })).to.be.true;

      activeBranch.forEach(commit => {
        expect(Commit.renderedWith({ commit, disabled: false })).to.be.true;
      });
    });
  });
});
