/* eslint-disable react/no-access-state-in-setstate */
import StateContainer, { attachGlobalListener } from './state-container';

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
    // TODO: find a better way
    if (instance === this) {
      return;
    }

    this.setState({
      commits: this.state.commits.concat([
        {
          state,
          checkout
        }])
    });
  };
}

export default new CommitsContainer();
