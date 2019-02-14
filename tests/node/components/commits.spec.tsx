import React from 'react';
import { createReactStub } from 'react-mock-component';
import { $render, describe, expect, it } from '../suite';
import Commits, { CommitProps } from '../../../src/components/commits';
import { ICommitsContainer } from '../../../src/commits-container';
import { Simulate } from 'react-dom/test-utils';
import createBranch from '../../../playground/factories/commits';

describe('Commits', () => {
  let commits!: ICommitsContainer;

  describe('master', () => {
    const master = createBranch(3);

    beforeEach(() => {
      commits = {
        state: {
          branches: [master],
          activeBranch: 0,
          head: master[master.length - 1].id
        },
        reset: () => {}
      };
    });

    it('should render all the commits', () => {
      const Commit = createReactStub<CommitProps>();

      $render(<Commits Commit={Commit} commits={commits} />);

      expect(Commit.renderedWith({ commit: master[0] })).to.be.true;
      expect(Commit.renderedWith({ commit: master[1] })).to.be.true;
      expect(Commit.renderedWith({ commit: master[2] })).to.be.true;
    });

    it('should mark commits after a checkout', () => {
      commits.state.head = master[1].id;

      const Commit = createReactStub<CommitProps>();

      $render(<Commits Commit={Commit} commits={commits} />);

      expect(Commit.renderedWith({ commit: master[0], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[1], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[2], disabled: true })).to.be.true;
    });

    it('should preview a checkout on mouse over', () => {
      const Commit = createReactStub<CommitProps>();

      const $commits = $render(<Commits Commit={Commit} commits={commits} />);

      Commit.sinonStub.resetHistory();
      Simulate.mouseOver($commits.find('.commit-node')[1]);

      expect(Commit.renderedWith({ commit: master[0], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[1], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[2], disabled: true })).to.be.true;
    });

    it('should stop previewing a checkout on mouse leave', () => {
      const Commit = createReactStub<CommitProps>();

      const $commits = $render(<Commits Commit={Commit} commits={commits} />);

      Simulate.mouseOver($commits.find('.commit-node')[1]);
      Commit.sinonStub.resetHistory();
      Simulate.mouseLeave($commits.find('.commit-node')[1]);

      expect(Commit.renderedWith({ commit: master[0], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[1], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[2], disabled: false })).to.be.true;
    });

    it('should preview a later checkout', () => {
      commits.state.head = master[0].id;

      const Commit = createReactStub<CommitProps>();

      const $commits = $render(<Commits Commit={Commit} commits={commits} />);

      Simulate.mouseOver($commits.find('.commit-node')[1]);

      expect(Commit.renderedWith({ commit: master[0], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[1], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[2], disabled: true })).to.be.true;
    });
  });

  describe('branches', () => {
    beforeEach(() => {
      const activeBranch = createBranch(2);

      commits = {
        state: {
          branches: [
            createBranch(2),
            activeBranch
          ],
          activeBranch: 1,
          head: activeBranch[activeBranch.length - 1].id
        },
        reset: () => {}
      };
    });

    it('should render all commits', () => {
      const Commit = createReactStub<CommitProps>();

      $render(<Commits commits={commits} Commit={Commit} />);

      commits.state.branches.forEach(branch => {
        branch.forEach(commit => {
          expect(Commit.renderedWith({ commit })).to.be.true;
        });
      });
    });
  });
});
