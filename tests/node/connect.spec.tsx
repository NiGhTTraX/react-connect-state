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

  it('should support one listener', () => {
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

    expect(View.lastProps.foo.state).to.deep.equal({ bar: 42 });
  });

  it('should support multiple listeners', () => {
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

    const View1 = createReactStub<ViewProps>();
    const View2 = createReactStub<ViewProps>();

    const ConnectedView1 = connectToState(View1, fooContainer, 'foo');
    const ConnectedView2 = connectToState(View2, fooContainer, 'foo');

    $render(<div>
      <ConnectedView1 />
      <ConnectedView2 />
    </div>);

    View1.sinonStub.reset();
    View2.sinonStub.reset();

    fooContainer.increment();

    expect(View1.lastProps.foo.state).to.deep.equal({ bar: 42 });
    expect(View2.lastProps.foo.state).to.deep.equal({ bar: 42 });
  });

  it('should bind multiple containers', () => {
    interface FooState {
      bar: number;
    }

    const fooContainer1 = Mock.ofType<StateContainer<FooState>>();
    const fooContainer2 = Mock.ofType<StateContainer<FooState>>();

    interface ViewProps {
      foo: StateContainer<FooState>;
      bar: StateContainer<FooState>;
    }

    const View = createReactStub<ViewProps>();
    const ConnectedView = connectToState(
      connectToState(View, fooContainer1.object, 'foo'),
      fooContainer2.object,
      'bar'
    );

    $render(<ConnectedView />);

    expect(View.renderedWith({
      foo: fooContainer1.object,
      bar: fooContainer2.object
    })).to.be.true;
  });
});
