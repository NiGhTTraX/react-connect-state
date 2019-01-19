/* eslint-disable react/no-access-state-in-setstate */
import StateContainer, { attachGlobalListener } from './state-container';

export interface StateCommit {
  state: any;
  checkout: () => void;
}

export interface CommitsState {
  commits: StateCommit[];
  detached: boolean;
}

class CommitsContainer extends StateContainer<CommitsState> {
  constructor() {
    super();

    this.reset();

    attachGlobalListener(this.onSetState);
  }

  reset() {
    this.state = { commits: [], detached: false };
  }

  private onSetState = (state: any, checkout: () => void, instance: StateContainer<any>) => {
    // We hide updates from us. This also prevents an infinite loop.
    if (instance === this) {
      return;
    }

    // Don't allow new commits in a detached state.
    if (this.state.detached) {
      return;
    }

    const head: StateCommit = {
      state,
      checkout: () => {
        this.setState({ detached: true });

        checkout();
      }
    };

    this.setState({
      commits: this.state.commits.concat([head])
    });
  };
}

export default new CommitsContainer();
