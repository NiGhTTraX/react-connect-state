import React, { Component } from 'react';
import classNames from 'classnames';
import { CommitProps } from './commits';
import './commit.less';

export default class Commit extends Component<CommitProps> {
  static defaultProps: Partial<CommitProps> = {
    disabled: false
  };

  render() {
    const { disabled } = this.props;

    return <div
      className={classNames('commit', { disabled })}
      onClick={this.props.commit.checkout}
    />;
  }
}
