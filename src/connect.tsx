import React, { Component, ComponentType } from 'react';
import StateContainer from './state-container';
import { Omit } from 'react-bind-component';

export default function connectToState<
  ViewProps extends Record<K, StateContainer<State>>,
  State,
  K extends string
>(
  View: ComponentType<ViewProps>,
  container: StateContainer<State>,
  prop: K
): ComponentType<Omit<ViewProps, K>> {
  return class ConnectedView extends Component<Omit<ViewProps, K>> {
    render() {
      const props = {
        ...this.props,
        [prop]: container
      };

      // @ts-ignore
      return <View {...props} />;
    }
  };
}
