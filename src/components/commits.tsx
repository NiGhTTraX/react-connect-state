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

    commits.forEach(c => {
      connectedCommits.push(
        <li className="commit" key={`commit${c.id}`} />,
        <li className="commit-divider" key={`divider${c.id}`} />
      );
    });

    return <ul className="master">
      {connectedCommits.slice(0, -1)}
    </ul>;
  }
}
