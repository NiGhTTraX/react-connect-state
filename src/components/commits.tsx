/* eslint-disable class-methods-use-this */
import React, { Component, ComponentType } from 'react';
import { ICommitsContainer, StateCommit } from '../commits-container';
import './commits.less';

export interface CommitProps {
  commit: StateCommit;
  disabled?: boolean; // Assume false.
}

export interface CommitsProps {
  commits: ICommitsContainer,
  Commit: ComponentType<CommitProps>
}

interface CommitsState {
  hover: StateCommit['id'];
}

export default class Commits extends Component<CommitsProps, CommitsState> {
  state = { hover: Infinity };

  render() {
    const { branches } = this.props.commits.state;

    return <div>
      {branches.length ? this.renderBranches() : null}
    </div>;
  }

  private renderCommits(commits: StateCommit[]) {
    const { Commit } = this.props;
    const connectedCommits: any[] = [];
    const head = this.props.commits.state.head || Infinity;

    commits.forEach(commit => {
      const disabled = this.state.hover !== Infinity
        ? commit.id > this.state.hover
        : commit.id > head;

      connectedCommits.push(
        // eslint-disable-next-line react/no-array-index-key
        <li className="commit-node" key={`commit${commit.id}`}
          onMouseOver={this.previewCheckout.bind(this, commit.id)}
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

  private renderBranches() {
    const { branches } = this.props.commits.state;

    return <ul className="branches">
      {/* eslint-disable-next-line react/no-array-index-key */}
      {branches.map((branch, i) => <li key={i}>
        {this.renderCommits(branch)}
      </li>)}
    </ul>;
  }

  private previewCheckout(id: number) {
    this.setState({ hover: id });
  }

  private clearCheckoutPreview = () => {
    this.setState({ hover: Infinity });
  };
}
