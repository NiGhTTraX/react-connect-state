/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { ICommitsContainer, StateCommit } from '../commits-container';
import './commits.less';

export interface CommitsProps {
  commits: ICommitsContainer
}

export default class Commits extends Component<CommitsProps> {
  render() {
    const { master } = this.props.commits.state;

    return <div>
      {this.connectCommits(master)}
    </div>;
  }

  private connectCommits(commits: StateCommit[]) {
    const connectedCommits: any[] = [];

    commits.forEach((c, i) => {
      // TODO: introduce commit IDs
      connectedCommits.push(
        // eslint-disable-next-line react/no-array-index-key
        <li className="commit" key={`commit${i}`} />,
        // eslint-disable-next-line react/no-array-index-key
        <li className="commit-divider" key={`divider${i}`} />
      );
    });

    return <ul className="master">
      {connectedCommits.slice(0, -1)}
    </ul>;
  }
}
