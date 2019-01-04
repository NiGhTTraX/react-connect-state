import React from 'react';
import { Mock } from 'typemoq';
import { $render, describe, expect, it } from './suite';
import connectToState from '../../src';
import StateContainer from '../../src/state-container';
import { createReactStub } from 'react-mock-component';

describe('connectToState', () => {
  it('should pass the container on the first render', () => {
    interface FooState {
      bar: number;
    }

    const fooContainer = Mock.ofType<StateContainer<FooState>>();

    interface ViewProps {
      foo: StateContainer<FooState>;
    }

    const View = createReactStub<ViewProps>();
    const ConnectedView = connectToState(View, fooContainer.object, 'foo');

    $render(<ConnectedView />);

    expect(View.renderedWith({ foo: fooContainer.object })).to.be.true;
  });

  it('should pass the updated container after a state change', () => {
    interface FooState {
      bar: number;
    }

    class FooContainer extends StateContainer<FooState> {
      increment() {
        this.setState({ bar: 42 });
      }
    }
    const fooContainer = new FooContainer();

    interface ViewProps {
      foo: StateContainer<FooState>;
    }

    const View = createReactStub<ViewProps>();
    const ConnectedView = connectToState(View, fooContainer, 'foo');

    $render(<ConnectedView />);

    View.sinonStub.reset();

    fooContainer.increment();

    expect(View.renderedWith({ foo: fooContainer })).to.be.true;
  });
});
