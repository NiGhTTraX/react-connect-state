import React from 'react';
import { createReactStub } from 'react-mock-component';
import { spy } from 'sinon';
import { Simulate } from 'react-dom/test-utils';
import { describe, it, $render, expect } from '../suite';
import Commit, { PrettyPrinter, TooltipProps } from '../../../src/components/commit';
import { It, Mock } from 'typemoq';

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

    const $commit = $render(<Commit Tooltip={Tooltip} commit={commit} prettyPrint={() => ''} />);

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
    const prettyPrintSpy = Mock.ofType<PrettyPrinter>();
    prettyPrintSpy
      // TODO: I don't care about the 2nd argument, especially since
      // it's optional; find a way to not have to specify it here
      .setup(x => x(commit.state, It.isAny()))
      .returns(() => 'this is the state');

    $render(<Commit
      Tooltip={Tooltip}
      commit={commit}
      prettyPrint={prettyPrintSpy.object}
    />);

    expect(
      $render(<span>{Tooltip.lastProps.title}</span>).text()
    ).to.contain('this is the state');
  });
});
