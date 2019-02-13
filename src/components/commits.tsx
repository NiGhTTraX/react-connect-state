import React, { Component } from 'react';
import { ICommitsContainer } from '../commits-container';

export interface CommitsProps {
  commits: ICommitsContainer
}

export default class Commits extends Component<CommitsProps> {
  render() {
    const { master } = this.props.commits.state;

    return <div>
      <ul className="master">
        {/* TODO: introduce commit IDs */}
        {/* eslint-disable-next-line react/no-array-index-key */}
        {master.map((commit, i) => <li className="commit" key={i}>
          Commit
        </li>)}
      </ul>
    </div>;
  }
}
