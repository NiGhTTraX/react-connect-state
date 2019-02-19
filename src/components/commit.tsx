import React, { Component, ComponentType, ReactElement, ReactNode } from 'react';
import classNames from 'classnames';
// eslint-disable-next-line no-unused-vars
import { CommitProps } from './commit-graph-debug';
import stringifyObject from 'stringify-object';
import './commit.less';

export interface TooltipProps {
  children: ReactElement<any>;
  title: ReactNode;
}

type PrettyPrintOptions = {
  indent?: string,
  inlineCharacterLimit?: number
};

export type PrettyPrinter = (object: any, options?: PrettyPrintOptions) => string;

interface CommitDeps {
  Tooltip: ComponentType<TooltipProps>;
  prettyPrint?: PrettyPrinter;
}

type Props = CommitProps & CommitDeps;

export default class Commit extends Component<Props> {
  static defaultProps = {
    disabled: false,
    prettyPrint: stringifyObject
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
    // TODO: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11640
    const { prettyPrint, commit } = this.props as Props & typeof Commit.defaultProps;

    return <div className="commit-info">
      <div className="commit-state">
        <pre>
          {prettyPrint(commit.state, { inlineCharacterLimit: 10 })}
        </pre>
      </div>
    </div>;
  }
}
