/* eslint-disable react/no-access-state-in-setstate */
import StateContainer, { attachGlobalListener, IStateContainer } from './state-container';

export interface StateCommit {
  /**
   * Self incrementing number that uniquely identifies a commit.
   *
   * Guarantees that if commit1.id < commit2.id then
   * commit1 happened before commit2.
   */
  id: number;
  state: any;
  instance: IStateContainer<any>;
  checkout: () => void;
  parent: StateCommit | null;
}

export interface CommitGraphState {
  branches: StateCommit[][];
  head: StateCommit | null;
  activeBranch: number;
}

export interface ICommitGraphContainer extends IStateContainer<CommitGraphState> {
  reset(): void;
}

type Snapshot = Map<StateContainer<any>, () => void>;
type SnapshotMap = Map<StateCommit['id'], Snapshot>;

// eslint-disable-next-line max-len
class CommitGraphContainer extends StateContainer<CommitGraphState> implements ICommitGraphContainer {
  private commitCount = 1;

  private snapshots: SnapshotMap = new Map<StateCommit['id'], Snapshot>();

  constructor() {
    super();

    this.reset();

    attachGlobalListener(this.onSetState);
  }

  reset() {
    this.state = {
      branches: [[]],
      head: null,
      activeBranch: 0
    };

    this.snapshots.clear();
  }

  private onSetState = (state: any, checkout: () => void, instance: StateContainer<any>) => {
    // We hide updates from us. This also prevents an infinite loop.
    if (instance === this) {
      return;
    }

    const activeBranchIndex = this.state.activeBranch;
    const activeBranch = this.state.branches[activeBranchIndex];
    const currentHead = this.state.head;
    const detached = currentHead
      ? activeBranch[activeBranch.length - 1].id !== currentHead.id
      : false;

    const newActiveBranch = detached ? activeBranchIndex + 1 : activeBranchIndex;

    const newHead: StateCommit = {
      id: this.commitCount,
      state,
      instance,
      checkout: () => this.doCheckout(newHead, newActiveBranch),
      parent: currentHead
    };

    this.commitCount++;

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

    const newBranches = [...this.state.branches];

    if (!detached) {
      newBranches[activeBranchIndex] = [
        ...this.state.branches[activeBranchIndex],
        newHead
      ];
    } else {
      newBranches.push([newHead]);
    }

    this.setState({
      branches: newBranches,
      activeBranch: newActiveBranch,
      head: newHead
    });
  };

  private doCheckout(head: StateCommit, activeBranch: number) {
    this.setState({ head, activeBranch });

    const snapshot = this.snapshots.get(head.id);

    // @ts-ignore
    snapshot.forEach(checkout => checkout());
  }
}

export default new CommitGraphContainer();
