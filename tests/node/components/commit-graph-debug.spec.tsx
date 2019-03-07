/* eslint-disable prefer-destructuring */
import React from 'react';
import createReactMock from 'react-mock-component';
import { Simulate } from 'react-dom/test-utils';
import { $render, describe, expect, it } from '../suite';
import CommitGraphDebugView, { CommitProps } from '../../../src/components/commit-graph-debug';
import { ICommitGraphContainer } from '../../../src/commit-graph';
import createBranch from '../../../playground/factories/commit';

describe('CommitGraphDebugView', () => {
  let commits!: ICommitGraphContainer;

  it('should not render anything if there are no commits', () => {
    const Commit = createReactMock<CommitProps>();

    const commitGraph = {
      state: {
        activeBranch: 0,
        branches: [[]],
        head: null
      },
      reset(): void {}
    };

    const $graph = $render(<CommitGraphDebugView Commit={Commit} commitGraph={commitGraph} />);

    expect(Commit.rendered).to.be.false;
    expect($graph.html()).to.be.undefined;
  });

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
      const Commit = createReactMock<CommitProps>();

      $render(<CommitGraphDebugView Commit={Commit} commitGraph={commits} />);

      expect(Commit.renderedWith({ commit: master[0] })).to.be.true;
      expect(Commit.renderedWith({ commit: master[1] })).to.be.true;
      expect(Commit.renderedWith({ commit: master[2] })).to.be.true;
    });

    it('should mark commits after a checkout', () => {
      commits.state.head = master[1];

      const Commit = createReactMock<CommitProps>();

      $render(<CommitGraphDebugView Commit={Commit} commitGraph={commits} />);

      expect(Commit.renderedWith({ commit: master[0], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[1], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[2], disabled: true })).to.be.true;
    });

    it('should preview a checkout on mouse over', () => {
      const Commit = createReactMock<CommitProps>();

      const $commits = $render(<CommitGraphDebugView Commit={Commit} commitGraph={commits} />);

      Commit.sinonStub.resetHistory();
      Simulate.mouseOver($commits.find('.commit-node')[1]);

      expect(Commit.renderedWith({ commit: master[0], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[1], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[2], disabled: true })).to.be.true;
    });

    it('should stop previewing a checkout on mouse leave', () => {
      const Commit = createReactMock<CommitProps>();

      const $commits = $render(<CommitGraphDebugView Commit={Commit} commitGraph={commits} />);

      Simulate.mouseOver($commits.find('.commit-node')[1]);
      Commit.sinonStub.resetHistory();
      Simulate.mouseLeave($commits.find('.commit-node')[1]);

      expect(Commit.renderedWith({ commit: master[0], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[1], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[2], disabled: false })).to.be.true;
    });

    it('should preview a later checkout', () => {
      commits.state.head = master[0];

      const Commit = createReactMock<CommitProps>();

      const $commits = $render(<CommitGraphDebugView Commit={Commit} commitGraph={commits} />);

      Simulate.mouseOver($commits.find('.commit-node')[1]);

      expect(Commit.renderedWith({ commit: master[0], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[1], disabled: false })).to.be.true;
      expect(Commit.renderedWith({ commit: master[2], disabled: true })).to.be.true;
    });
  });

  describe('branches', () => {
    const masterBranch = createBranch(4);
    const activeBranch = createBranch(2);
    activeBranch[0].parent = masterBranch[1];

    beforeEach(() => {
      commits = {
        state: {
          branches: [
            masterBranch,
            activeBranch
          ],
          activeBranch: 1,
          head: activeBranch[activeBranch.length - 1]
        },
        reset: () => {}
      };
    });

    it('should render all commits', () => {
      const Commit = createReactMock<CommitProps>();

      $render(<CommitGraphDebugView commitGraph={commits} Commit={Commit} />);

      commits.state.branches.forEach(branch => {
        branch.forEach(commit => {
          expect(Commit.renderedWith({ commit })).to.be.true;
        });
      });
    });

    it('should not mark the inactive branches as checked out', () => {
      const Commit = createReactMock<CommitProps>();

      $render(<CommitGraphDebugView commitGraph={commits} Commit={Commit} />);

      masterBranch.forEach(commit => {
        expect(Commit.renderedWith({ commit, disabled: false })).to.be.true;
      });
    });

    it('should preview the correct branch on hover', () => {
      const Commit = createReactMock<CommitProps>();

      const $commits = $render(<CommitGraphDebugView commitGraph={commits} Commit={Commit} />);
      Commit.sinonStub.resetHistory();

      const $firstBranch = $commits.find('.branch').eq(0);
      Simulate.mouseOver($firstBranch.find('.commit-node')[0]);


      expect(Commit.renderedWith({ commit: masterBranch[0], disabled: false })).to.be.true;
      masterBranch.slice(1).forEach(commit => {
        expect(Commit.renderedWith({ commit, disabled: true })).to.be.true;
      });

      activeBranch.forEach(commit => {
        expect(Commit.renderedWith({ commit, disabled: false })).to.be.true;
      });
    });

    it('should properly position branches', () => {
      const Commit = createReactMock<CommitProps>();
      Commit.withProps({}).renders(<span>X</span>);

      const $commits = $render(<CommitGraphDebugView commitGraph={commits} Commit={Commit} />);
      const cells = $commits.find('.commit-node')
        .map((_, n) => n.textContent)
        .get();

      expect(cells).to.deep.equal([
        'X', 'X', 'X', 'X',
        // eslint-disable-next-line no-multi-spaces
        '',  'X', 'X', ''
      ]);
    });
  });
});
