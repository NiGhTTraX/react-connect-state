/* eslint-disable class-methods-use-this */
import React, { Component, ComponentType } from 'react';
import { ICommitGraphContainer, StateCommit } from '../commit-graph';
import './commit-graph.less';

export interface CommitProps {
  commit: StateCommit;
  disabled?: boolean; // Assume false.
}

export interface CommitGraphProps {
  commitGraph: ICommitGraphContainer,
  Commit: ComponentType<CommitProps>
}

interface CommitGraphViewState {
  hoverCommit: StateCommit['id'];
  hoverBranch: number;
}

// TODO: find a  better name; it's not just displaying the commit graph, but it's also allowing
// commits to be checked out; time travel? debug? replay? interactive?
export default class CommitGraph extends Component<CommitGraphProps, CommitGraphViewState> {
  private static addPadding(row: any[], num: number) {
    for (let i = 0; i < num; i++) {
      row.push(
        <td className="commit-node" key={`commit-${row.length}`} />,
        <td className="tdd" key={`divider-${row.length}`} />
      );
    }
  }

  state = {
    hoverCommit: Infinity,
    hoverBranch: this.props.commitGraph.state.activeBranch
  };

  render() {
    const { head } = this.props.commitGraph.state;

    if (!head) {
      return null;
    }

    return <table className="branches">
      <tbody>
        {this.renderBranches()}
      </tbody>
    </table>;
  }

  private renderBranches() {
    const { branches } = this.props.commitGraph.state;
    const [commitPositions, width] = this.getCommitPositions();

    return branches.map((branch, i) => {
      const row: any[] = [];

      const leftPadding = commitPositions.get(branch[0].id);
      // @ts-ignore because `leftPadding` will always be defined
      const rightPadding = width - branch.length - leftPadding;

      // @ts-ignore because `leftPadding` will always be defined
      CommitGraph.addPadding(row, leftPadding);

      branch.forEach(commit => {
        row.push(...this.renderCommitCell(commit, i));
      });

      // Pop the last divider.
      row.pop();

      if (rightPadding > 0) {
        row.push(<td className="tdd" key="divider-before-padding" />);
        CommitGraph.addPadding(row, rightPadding);
      }

      // eslint-disable-next-line react/no-array-index-key
      return <tr className="branch" key={`row-${i}`}>{row}</tr>;
    });
  }

  private renderCommitCell(commit: StateCommit, branchNo: number) {
    const { Commit } = this.props;
    const { hoverBranch, hoverCommit } = this.state;
    const { head } = this.props.commitGraph.state;
    const onActiveBranch = branchNo === hoverBranch;

    const afterHead = hoverCommit !== Infinity
      ? commit.id > hoverCommit
      : commit.id > (head ? head.id : Infinity);

    const disabled = onActiveBranch && afterHead;

    return [
      <td className="commit-node" key={`commit${commit.id}`}
        onMouseOver={this.previewCheckout.bind(this, commit.id, branchNo)}
        onMouseLeave={this.clearCheckoutPreview}
      >
        <Commit commit={commit} disabled={disabled} />
      </td>,
      <td className="tdd" key={`divider${commit.id}`}><div className="commit-divider" /></td>
    ];
  }

  /**
   * Arrange the commits in a horizontal gitk style with
   * the branches one after the other.
   *
   * @example
   *           | 0 | 1 | 2 | 3 | 4 |
   *           |---|---|---|---|---|
   * branch[0] | X | X | X | X | X |
   *           |   | | |   |   |   |
   * branch[1] |   | X | X |   |   |
   *           |   |   | | |   |   |
   * branch[2] |   |   | X | X |   |
   *
   * @returns A Map with the positions (id -> index) and the width of the table.
   */
  private getCommitPositions(): [Map<number, number>, number] {
    const { branches } = this.props.commitGraph.state;

    const positions = new Map<number, number>();
    let width = 0;

    const setPositions = (branch: StateCommit[], offset: number) => {
      branch.forEach((commit, i) => {
        positions.set(commit.id, i + offset);
        width = Math.max(width, i);
      });
    };

    setPositions(branches[0], 0);

    branches.slice(1).forEach(branch => {
      const offset = positions.get(branch[0].parent ? branch[0].parent.id : -1) || 0;

      setPositions(branch, offset);
    });

    return [positions, width + 1];
  }

  private previewCheckout(id: number, branch: number) {
    this.setState({ hoverCommit: id, hoverBranch: branch });
  }

  private clearCheckoutPreview = () => {
    this.setState({
      hoverCommit: Infinity,
      hoverBranch: this.props.commitGraph.state.activeBranch
    });
  };
}
