/* eslint-disable react/no-access-state-in-setstate */
export type Listener<T> = (state: T) => void;

type GlobalListener = (
  state: any,
  checkout: () => void,
  instance: StateContainer<any>
) => void;

let globalListener: GlobalListener = () => {};

export function attachGlobalListener(listener: GlobalListener) {
  globalListener = listener;
}

export interface IStateContainer<T> {
  state: T;
}

export interface IStateEmitter<T> {
  addListener(listener: Listener<T>): void;
}

export default abstract class StateContainer<T> implements IStateContainer<T>, IStateEmitter<T> {
  private listeners: Listener<T>[] = [];

  // This can result in runtime errors if the derived class doesn't
  // initialize the state. TODO: how can we prevent this?
  state!: T;

  protected setState(partialState: Partial<T>) {
    this.state = Object.assign({}, this.state, partialState);

    this.notifyPublicListeners();
    this.notifyGlobalListener();
  }

  /**
   * Checkout a previous state without informing the global listener.
   */
  private checkout(state: T) {
    this.state = state;

    this.notifyPublicListeners();
  }

  private notifyPublicListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  private notifyGlobalListener() {
    globalListener(
      this.state,
      this.checkout.bind(this, this.state),
      this
    );
  }

  addListener(listener: Listener<T>) {
    this.listeners.push(listener);
  }
}
