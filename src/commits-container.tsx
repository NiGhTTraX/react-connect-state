/* eslint-disable react/no-access-state-in-setstate */
import StateContainer, { attachGlobalListener, IStateContainer } from './state-container';

export interface StateCommit {
  id: number;
  state: any;
  instance: IStateContainer<any>;
  checkout: () => void;
  parent: StateCommit | null;
}

export interface CommitsState {
  master: StateCommit[];
  branches: StateCommit[][];
  detached: boolean;
}

export interface ICommitsContainer extends IStateContainer<CommitsState> {
  reset(): void;
}

type Snapshot = Map<StateContainer<any>, () => void>;
type SnapshotMap = Map<StateCommit['id'], Snapshot>;

class CommitsContainer extends StateContainer<CommitsState> implements ICommitsContainer {
  private commitCount = 1;

  private snapshots: SnapshotMap = new Map<StateCommit['id'], Snapshot>();

  constructor() {
    super();

    this.reset();

    attachGlobalListener(this.onSetState);
  }

  reset() {
    this.state = {
      master: [],
      branches: [],
      detached: false
    };

    this.snapshots.clear();
  }

  private onSetState = (state: any, checkout: () => void, instance: StateContainer<any>) => {
    // We hide updates from us. This also prevents an infinite loop.
    if (instance === this) {
      return;
    }

    const currentHeadIndex = this.state.master.length - 1;
    const currentHead = this.state.master[currentHeadIndex] || null;

    const newHead: StateCommit = {
      id: this.commitCount,
      state,
      instance,
      checkout: this.doCheckout.bind(this, this.commitCount),
      // TODO: handle different branches
      parent: currentHead
    };

    this.commitCount++;

    if (this.state.detached) {
      this.setState({
        branches: [...this.state.branches, [newHead]],
        detached: false
      });

      return;
    }

    // Shallow clone the previous snapshot and update the key for
    // this instance. Assuming the number of instances remains small
    // this shouldn't be too expensive.
    // @ts-ignore
    const prevSnapshot: Snapshot = currentHead
      ? this.snapshots.get(currentHead.id)
      : new Map() as Snapshot;
    const newSnapshot = new Map(prevSnapshot);
    newSnapshot.set(instance, checkout);

    this.snapshots.set(newHead.id, newSnapshot);

    this.setState({
      master: currentHead ? [
        ...this.state.master.slice(0, -1),
        { ...currentHead },
        newHead
      ] : [newHead]
    });
  };

  private doCheckout(id: number) {
    this.setState({ detached: true });

    const snapshot = this.snapshots.get(id);

    // @ts-ignore
    snapshot.forEach(checkout => checkout());
  }
}

export default new CommitsContainer();
