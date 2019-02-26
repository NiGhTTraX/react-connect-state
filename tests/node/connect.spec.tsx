import React from 'react';
import { Mock } from 'typemoq';
import { $render, describe, expect, it, unmount, beforeEach, afterEach } from './suite';
import connectToState from '../../src';
import StateContainer, { IStateContainer } from '../../src/state-container';
import { createReactStub } from 'react-mock-component';
import connectToState2 from '../../src/connect2';

describe('connectToState', () => {
  let originalConsoleError: (msg?: string, ...args: any[]) => void;

  beforeEach(() => {
    originalConsoleError = console.error;

    console.error = (message?: any, ...args: any[]) => {
      if (message && /^Warning:/.test(message)) {
        throw new Error(message);
      }

      originalConsoleError(message, ...args);
    };
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  interface FooState {
    bar: number;
  }

  interface ViewProps {
    foo: StateContainer<FooState>;
  }

  class FooContainer extends StateContainer<FooState> {
    increment = () => {
      this.setState({ bar: 42 });
    };
  }

  it('should pass the container on the first render', () => {
    const fooContainer = Mock.ofType<StateContainer<FooState>>();
    const View = createReactStub<ViewProps>();
    const ConnectedView = connectToState(View, fooContainer.object, 'foo');

    $render(<ConnectedView />);

    expect(View.renderedWith({ foo: fooContainer.object })).to.be.true;
  });

  it('should support one listener', () => {
    const fooContainer = new FooContainer();
    const View = createReactStub<ViewProps>();
    const ConnectedView = connectToState(View, fooContainer, 'foo');

    $render(<ConnectedView />);

    View.sinonStub.reset();

    fooContainer.increment();

    expect(View.lastProps.foo.state).to.deep.equal({ bar: 42 });
  });

  it('should support multiple listeners', () => {
    const fooContainer = new FooContainer();

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
    const fooContainer1 = Mock.ofType<StateContainer<FooState>>();
    const fooContainer2 = Mock.ofType<StateContainer<FooState>>();

    interface ViewWithMultipleContainersProps {
      foo: IStateContainer<FooState>;
      bar: IStateContainer<FooState>;
    }

    const View = createReactStub<ViewWithMultipleContainersProps>();
    const ConnectedView = connectToState2(View, {
      foo: fooContainer1.object,
      bar: fooContainer2.object
    });

    $render(<ConnectedView />);

    expect(View.renderedWith({
      foo: fooContainer1.object,
      bar: fooContainer2.object
    })).to.be.true;
  });

  it('should bind multiple containers and require the rest', () => {
    const fooContainer1 = Mock.ofType<StateContainer<FooState>>();
    const fooContainer2 = Mock.ofType<StateContainer<FooState>>();
    const fooContainer3 = Mock.ofType<StateContainer<FooState>>();

    interface ViewWithMultipleContainersProps {
      foo: IStateContainer<FooState>;
      bar: IStateContainer<FooState>;
      baz: IStateContainer<FooState>;
    }

    const View = createReactStub<ViewWithMultipleContainersProps>();
    const ConnectedView = connectToState2(View, {
      foo: fooContainer1.object,
      bar: fooContainer2.object
    });

    $render(<ConnectedView baz={fooContainer3.object} />);

    expect(View.renderedWith({
      foo: fooContainer1.object,
      bar: fooContainer2.object,
      baz: fooContainer3.object
    })).to.be.true;
  });

  it('should remove the listener after unmounting', () => {
    const fooContainer = new FooContainer();
    const View = createReactStub<ViewProps>();
    const ConnectedView = connectToState(View, fooContainer, 'foo');

    $render(<ConnectedView />);
    unmount();

    expect(fooContainer.increment).to.not.throw();
  });
});
