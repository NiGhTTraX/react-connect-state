import React, { Component, ComponentType, CSSProperties, ReactElement, ReactNode } from 'react';
// eslint-disable-next-line no-unused-vars
import { CommitProps } from './commit-graph-debug';
import stringifyObject from 'stringify-object';

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

    const styles: CSSProperties = {
      boxSizing: 'border-box',
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'beige',
      border: '1px solid chocolate',
      transition: 'all .2s'
    };

    if (disabled) {
      styles.background = '#ccc';
    }

    return <Tooltip title={this.renderCommitInfo()}>
      <div style={styles} className="commit" onClick={this.props.commit.checkout} />
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
