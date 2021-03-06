/* eslint-disable class-methods-use-this,react/no-array-index-key */
import React, { Component, ComponentType, CSSProperties } from 'react';
import { ICommitGraphContainer, StateCommit } from '../commit-graph';

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

const STYLES = {
  commitNode: {
    verticalAlign: 'middle',
    textAlign: 'center',
    height: 10,
    width: 10
  } as CSSProperties,

  commitConnector: {
    width: '100%',
    height: 2,
    border: '1px solid coral',
    background: 'chocolate'
  } as CSSProperties,

  commitDivider: {
    verticalAlign: 'middle',
    textAlign: 'center',
    width: 20
  } as CSSProperties
};

// This is named *View to avoid a naming clash with the index export.
// eslint-disable-next-line max-len
export default class CommitGraphDebugView extends Component<CommitGraphProps, CommitGraphViewState> {
  private static addPadding(row: any[], num: number) {
    for (let i = 0; i < num; i++) {
      row.push(
        <td style={STYLES.commitNode} className="commit-node" key={`commit-${row.length}`} />,
        <td style={STYLES.commitDivider} key={`divider-${row.length}`} />
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

    return <table>
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
      CommitGraphDebugView.addPadding(row, leftPadding);

      branch.forEach(commit => {
        row.push(...this.renderCommitCell(commit, i));
      });

      // Pop the last divider.
      row.pop();

      if (rightPadding > 0) {
        row.push(<td style={STYLES.commitDivider} key="divider-before-padding" />);
        CommitGraphDebugView.addPadding(row, rightPadding);
      }

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
      // @ts-ignore because no head means no commits and we don't reach
      // this point in that case.
      : commit.id > head.id;

    const disabled = onActiveBranch && afterHead;

    return [
      <td style={STYLES.commitNode} className="commit-node" key={`commit${commit.id}`}
        onMouseOver={this.previewCheckout.bind(this, commit.id, branchNo)}
        onMouseLeave={this.clearCheckoutPreview}
      >
        <Commit commit={commit} disabled={disabled} />
      </td>,
      <td style={STYLES.commitDivider} key={`divider${commit.id}`}>
        <div style={STYLES.commitConnector} />
      </td>
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
      // @ts-ignore because every non-master branch has a parent and
      // the map will contain a position for it.
      setPositions(branch, positions.get(branch[0].parent.id));
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
