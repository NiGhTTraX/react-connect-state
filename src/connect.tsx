import React, { Component, ComponentType } from 'react';
import bindComponent, { Omit } from 'react-bind-component';
// eslint-disable-next-line no-unused-vars
import { IStateContainer, IStateEmitter } from './state-container';

export type PropsThatAllowContainers<ViewProps, SC extends IStateContainer<any>> = {
  [P in keyof ViewProps]: ViewProps[P] extends SC ? P : never
}[keyof ViewProps];

type BindableContainers<ViewProps> = {
  // eslint-disable-next-line max-len
  [P in PropsThatAllowContainers<ViewProps, IStateContainer<any>>]: ViewProps[P] extends IStateContainer<infer U>
    ? ViewProps[P] & IStateEmitter<U>
    : never
};

export default function connectToState<
  ViewProps,
  K extends PropsThatAllowContainers<ViewProps, IStateContainer<any>>
>(
  View: ComponentType<ViewProps>,
  containersToBindTo: Pick<BindableContainers<ViewProps>, K>
): ComponentType<Omit<ViewProps, K>> {
  const BoundView = bindComponent(View, containersToBindTo);

  return class ConnectedView extends Component<Omit<ViewProps, K>> {
    static displayName = `connected(${View.displayName || View.name})`;

    render() {
      return <BoundView {...this.props} />;
    }

    componentDidMount() {
      this.subOrUnsub('subscribe');
    }

    componentWillUnmount() {
      this.subOrUnsub('unsubscribe');
    }

    private onStateUpdate = () => this.forceUpdate();

    private subOrUnsub(method: 'subscribe'|'unsubscribe') {
      // TODO: I'm not sure why `containersToBindTo` needs to be cast.
      Object.values(containersToBindTo as Record<string, IStateEmitter<any>>).forEach(
        container => container[method](this.onStateUpdate)
      );
    }
  };
}
