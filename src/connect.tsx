import React, { Component, ComponentType } from 'react';
import StateContainer from './state-container';
import bindComponent, { Omit } from 'react-bind-component';

export default function connectToState<
  ViewProps extends Record<K, StateContainer<State>>,
  State,
  K extends string
>(
  View: ComponentType<ViewProps>,
  container: StateContainer<State>,
  prop: K
): ComponentType<Omit<ViewProps, K>> {
  // @ts-ignore TODO: https://github.com/Microsoft/TypeScript/issues/13948
  const BoundView = bindComponent(View, { [prop]: container });

  return class ConnectedView extends Component<Omit<ViewProps, K>> {
    render() {
      return <BoundView {...this.props} />;
    }

    componentDidMount() {
      container.addListener(() => this.forceUpdate());
    }
  };
}
