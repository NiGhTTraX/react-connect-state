import React from 'react';
import { createReactStub } from 'react-mock-component';
import { spy } from 'sinon';
import { Simulate } from 'react-dom/test-utils';
import { describe, it, $render, expect } from '../suite';
import Commit, { TooltipProps } from '../../../src/components/commit';

describe('Commit', () => {
  it('should checkout the commit when clicked', () => {
    const commit = {
      id: 1,
      instance: { state: {} },
      state: {},
      parent: null,
      checkout: spy()
    };
    const Tooltip = (props: TooltipProps) => props.children;

    const $commit = $render(<Commit Tooltip={Tooltip} commit={commit} />);

    Simulate.click($commit[0]);

    expect(commit.checkout).to.have.been.calledOnce;
  });

  it('should display the state in the tooltip', () => {
    const commit = {
      id: 1,
      instance: { state: { foo: 'bar' } },
      state: { foo: 'bar' },
      parent: null,
      checkout: () => {}
    };
    const Tooltip = createReactStub<TooltipProps>();

    $render(<Commit Tooltip={Tooltip} commit={commit} />);

    expect(
      $render(<span>{Tooltip.lastProps.title}</span>).text()
    ).to.contain(JSON.stringify(commit.state));
  });
});
