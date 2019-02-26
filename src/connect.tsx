import React, { Component, ComponentType } from 'react';
import bindComponent, { Omit } from 'react-bind-component';
// eslint-disable-next-line no-unused-vars
import { IStateContainer, IStateEmitter } from './state-container';

type PropsThatAllowContainers<ViewProps> = {
  [P in keyof ViewProps]: ViewProps[P] extends IStateContainer<any> ? P : never
}[keyof ViewProps];

type BindableContainers<ViewProps> = {
  // eslint-disable-next-line max-len
  [P in keyof ViewProps]: ViewProps[P] extends IStateContainer<infer U> ? IStateContainer<U> & IStateEmitter<U> : never
};

export default function connectToState<
  ViewProps,
  K extends PropsThatAllowContainers<ViewProps>
>(
  View: ComponentType<ViewProps>,
  containersToBindTo: Pick<BindableContainers<ViewProps>, K>
): ComponentType<Omit<ViewProps, K>> {
  // @ts-ignore
  const BoundView = bindComponent(View, containersToBindTo);

  return class ConnectedView extends Component<Omit<ViewProps, K>> {
    static displayName = `connected(${View.displayName || View.name})`;

    render() {
      return <BoundView {...this.props} />;
    }

    componentDidMount() {
      Object.values(containersToBindTo as Record<string, IStateEmitter<any>>).forEach(
        container => container.subscribe(this.onStateUpdate)
      );
    }

    componentWillUnmount() {
      Object.values(containersToBindTo as Record<string, IStateEmitter<any>>).forEach(
        container => container.unsubscribe(this.onStateUpdate)
      );
    }

    private onStateUpdate = () => this.forceUpdate();
  };
}
