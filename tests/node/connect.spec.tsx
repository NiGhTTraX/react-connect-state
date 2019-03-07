import React from 'react';
import createReactMock from 'react-mock-component';
import { Mock } from 'typemoq';
import { $render, describe, expect, it, unmount, beforeEach, afterEach } from './suite';
import StateContainer, { IStateContainer } from '../../src/state-container';
import connectToState from '../../src/connect';

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
    const View = createReactMock<ViewProps>();
    const ConnectedView = connectToState(View, { foo: fooContainer.object });

    $render(<ConnectedView />);

    expect(View.renderedWith({ foo: fooContainer.object })).to.be.true;
  });

  it('should support one listener', () => {
    const fooContainer = new FooContainer();
    const View = createReactMock<ViewProps>();
    const ConnectedView = connectToState(View, { foo: fooContainer });

    $render(<ConnectedView />);

    View.sinonStub.reset();

    fooContainer.increment();

    expect(View.lastProps.foo.state).to.deep.equal({ bar: 42 });
  });

  it('should support multiple listeners', () => {
    const fooContainer = new FooContainer();

    const View1 = createReactMock<ViewProps>();
    const View2 = createReactMock<ViewProps>();

    const ConnectedView1 = connectToState(View1, { foo: fooContainer });
    const ConnectedView2 = connectToState(View2, { foo: fooContainer });

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

    const View = createReactMock<ViewWithMultipleContainersProps>();
    const ConnectedView = connectToState(View, {
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

    const View = createReactMock<ViewWithMultipleContainersProps>();
    const ConnectedView = connectToState(View, {
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
    const View = createReactMock<ViewProps>();
    const ConnectedView = connectToState(View, { foo: fooContainer });

    $render(<ConnectedView />);
    unmount();

    expect(fooContainer.increment).to.not.throw();
  });
});
