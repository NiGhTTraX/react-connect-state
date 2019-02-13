import React, { Component, ComponentType } from 'react';
import bindComponent, { Omit } from 'react-bind-component';
import { IStateContainer, IStateEmitter } from './state-container';

export default function connectToState<
  ViewProps extends Record<K, IStateContainer<State>>,
  State,
  K extends string
>(
  View: ComponentType<ViewProps>,
  container: IStateEmitter<State>,
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
