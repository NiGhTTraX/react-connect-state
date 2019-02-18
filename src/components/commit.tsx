import React, { Component, ComponentType, ReactElement, ReactNode } from 'react';
import classNames from 'classnames';
import { CommitProps } from './commit-graph-debug';
import './commit.less';

export interface TooltipProps {
  children: ReactElement<any>;
  title: ReactNode;
}

interface CommitDeps {
  Tooltip: ComponentType<TooltipProps>;
}

export default class Commit extends Component<CommitProps & CommitDeps> {
  static defaultProps: Partial<CommitProps> = {
    disabled: false
  };

  render() {
    const { Tooltip, disabled } = this.props;

    return <Tooltip title={this.renderCommitInfo()}>
      <div
        className={classNames('commit', { disabled })}
        onClick={this.props.commit.checkout}
      />
    </Tooltip>;
  }

  private renderCommitInfo() {
    return <div className="commit-info">
      {JSON.stringify(this.props.commit.state)}
    </div>;
  }
}
