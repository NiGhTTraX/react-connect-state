import React from 'react';
import createReactMock from 'react-mock-component';
import { spy } from 'sinon';
import { It, Mock } from 'typemoq';
import Commit, { PrettyPrinter, TooltipProps } from '../../../src/components/commit';
import { describe, it } from 'tdd-buffet/suite/node';
import { $render, click } from '@tdd-buffet/react';
import { expect } from '../../expect';

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

    $render(<Commit Tooltip={Tooltip} commit={commit} prettyPrint={() => ''} />);

    click('.commit');

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
    const Tooltip = createReactMock<TooltipProps>();
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
