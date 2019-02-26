import React, { Component, ComponentType } from 'react';
import bindComponent, { Omit } from 'react-bind-component';
// eslint-disable-next-line no-unused-vars
import { IStateContainer, IStateEmitter } from './state-container';

export default function connectToState<
  ViewProps extends {
    // eslint-disable-next-line
    [K in keyof ContainerProps]: ContainerProps[K] extends IStateEmitter<infer U> ? IStateContainer<U> : never
  },
  ContainerProps extends Record<string, IStateEmitter<any>>
>(
  View: ComponentType<ViewProps>,
  containerProps: ContainerProps
): ComponentType<Omit<ViewProps, keyof ContainerProps>> {
  // @ts-ignore TODO: https://github.com/Microsoft/TypeScript/issues/13948
  const BoundView = bindComponent(View, containerProps);

  return class ConnectedView extends Component<Omit<ViewProps, keyof ContainerProps>> {
    static displayName = `connected(${View.displayName || View.name})`;

    render() {
      return <BoundView {...this.props} />;
    }

    componentDidMount() {
      Object.values(containerProps).forEach(
        container => container.subscribe(this.onStateUpdate)
      );
    }

    componentWillUnmount() {
      Object.values(containerProps).forEach(
        container => container.unsubscribe(this.onStateUpdate)
      );
    }

    private onStateUpdate = () => this.forceUpdate();
  };
}
