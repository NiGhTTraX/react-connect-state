/* eslint-disable class-methods-use-this */
import React, { Component, ComponentType } from 'react';
import { ICommitsContainer, StateCommit } from '../commits-container';
import './commits.less';

export interface CommitProps {
  commit: StateCommit;
}

export interface CommitsProps {
  commits: ICommitsContainer,
  Commit: ComponentType<CommitProps>
}

export default class Commits extends Component<CommitsProps> {
  render() {
    const { master } = this.props.commits.state;

    return <div>
      {this.connectCommits(master)}
    </div>;
  }

  private connectCommits(commits: StateCommit[]) {
    const { Commit } = this.props;
    const connectedCommits: any[] = [];

    commits.forEach(c => {
      connectedCommits.push(
        // eslint-disable-next-line react/no-array-index-key
        <li className="commit-node" key={`commit${c.id}`}>
          <Commit commit={c} />
        </li>,
        // eslint-disable-next-line react/no-array-index-key
        <li className="commit-divider" key={`divider${c.id}`} />
      );
    });

    return <ul className="master">
      {connectedCommits.slice(0, -1)}
    </ul>;
  }
}
