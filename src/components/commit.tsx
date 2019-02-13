import React, { Component } from 'react';
import { CommitProps } from './commits';
import './commit.less';

export default class Commit extends Component<CommitProps> {
  render() {
    return <div className="commit" onClick={this.props.commit.checkout} />;
  }
}
