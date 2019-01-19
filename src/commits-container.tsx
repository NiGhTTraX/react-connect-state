/* eslint-disable react/no-access-state-in-setstate */
import StateContainer, { attachGlobalListener } from './state-container';

export interface StateCommit {
  state: any;
  checkout: () => void;
}

export interface CommitsState {
  master: StateCommit[];
  branches: StateCommit[][];
  detached: boolean;
}

class CommitsContainer extends StateContainer<CommitsState> {
  constructor() {
    super();

    this.reset();

    attachGlobalListener(this.onSetState);
  }

  reset() {
    this.state = { master: [], branches: [], detached: false };
  }

  private onSetState = (state: any, checkout: () => void, instance: StateContainer<any>) => {
    // We hide updates from us. This also prevents an infinite loop.
    if (instance === this) {
      return;
    }

    const head: StateCommit = {
      state,
      checkout: () => {
        this.setState({ detached: true });

        checkout();
      }
    };

    if (this.state.detached) {
      this.setState({
        branches: [...this.state.branches, [head]],
        detached: false
      });

      return;
    }

    this.setState({
      master: [...this.state.master, head]
    });
  };
}

export default new CommitsContainer();
