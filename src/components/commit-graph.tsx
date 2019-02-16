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

export default class CommitGraph extends Component<CommitGraphProps, CommitGraphViewState> {
  state = {
    hoverCommit: Infinity,
    hoverBranch: this.props.commitGraph.state.activeBranch
  };

  render() {
    return <div>
      {this.renderBranches()}
    </div>;
  }

  private renderBranches() {
    const { branches } = this.props.commitGraph.state;

    return <ul className="branches">
      {/* eslint-disable-next-line react/no-array-index-key */}
      {branches.map((branch, i) => <li key={i}>
        {this.renderCommits(branch, i)}
      </li>)}
    </ul>;
  }

  private renderCommits(commits: StateCommit[], branch: number) {
    const { Commit } = this.props;
    const { hoverBranch, hoverCommit } = this.state;
    const { head } = this.props.commitGraph.state;

    const onActiveBranch = branch === hoverBranch;

    const connectedCommits: any[] = [];

    commits.forEach(commit => {
      const afterHead = hoverCommit !== Infinity
        ? commit.id > hoverCommit
        : commit.id > (head ? head.id : Infinity);

      const disabled = onActiveBranch && afterHead;

      connectedCommits.push(
        // eslint-disable-next-line react/no-array-index-key
        <li className="commit-node" key={`commit${commit.id}`}
          onMouseOver={this.previewCheckout.bind(this, commit.id, branch)}
          onMouseLeave={this.clearCheckoutPreview}
        >
          <Commit commit={commit} disabled={disabled} />
        </li>,
        // eslint-disable-next-line react/no-array-index-key
        <li className="commit-divider" key={`divider${commit.id}`} />
      );
    });

    return <ul className="branch">
      {connectedCommits.slice(0, -1)}
    </ul>;
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
