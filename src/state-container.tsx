/* eslint-disable react/no-access-state-in-setstate */
type Listener<T> = (state: T) => void;

type GlobalListener = (state: any, commit: () => void) => void;

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

    this.notifyListeners();
    globalListener(this.state, this.setState.bind(this, this.state));
  }

  // TODO: make this private
  protected notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  public addListener(listener: Listener<T>) {
    this.listeners.push(listener);
  }
}

export interface StateCommit {
  state: any;
  commit: () => void;
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

  private onSetState = (state: any, commit: () => void) => {
    // We're not using setState because that would cause an infinite loop.
    this.state.commits = this.state.commits.concat([{
      state,
      commit
    }]);

    this.notifyListeners();
  }
}

const commitsContainer = new CommitsContainer();

export { commitsContainer };
