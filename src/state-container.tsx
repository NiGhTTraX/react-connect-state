/* eslint-disable react/no-access-state-in-setstate */
type Listener<T> = (state: T) => void;

type GlobalListener = (
  state: any,
  checkout: () => void,
  instance: StateContainer<any>
) => void;

let globalListener: GlobalListener = () => {};

function attachGlobalListener(listener: GlobalListener) {
  globalListener = listener;
}

export default abstract class StateContainer<T> {
  private listeners: Listener<T>[] = [];

  // This can result in runtime errors if the derived class doesn't
  // initialize the state. TODO: how can we prevent this?
  state!: T;

  protected setState(partialState: Partial<T>) {
    this.state = Object.assign({}, this.state, partialState);
    this.notify();
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.state));

    globalListener(
      this.state,
      this.setState.bind(this, this.state),
      this
    );
  }

  public addListener(listener: Listener<T>) {
    this.listeners.push(listener);
  }
}

export interface StateCommit {
  state: any;
  checkout: () => void;
}

export interface CommitsState {
  commits: StateCommit[];
}

class CommitsContainer extends StateContainer<CommitsState> {
  constructor() {
    super();

    this.reset();

    attachGlobalListener(this.onSetState);
  }

  reset() {
    this.state = { commits: [] };
  }

  private onSetState = (state: any, checkout: () => void, instance: StateContainer<any>) => {
    // We hide updates from us. This also prevents an infinite loop.
    if (instance === this) {
      return;
    }

    this.setState({
      commits: this.state.commits.concat([{
        state,
        checkout
      }])
    });
  }
}

const commitsContainer = new CommitsContainer();

export { commitsContainer };
