import bindComponent from 'react-bind-component';
import connectToState from './connect';
import StateContainer, { setStateCommitListener } from './state-container';
import StateCommitGraph from './commit-graph';
import CommitGraphDebugView from './components/commit-graph-debug';
import Commit from './components/commit';

export default connectToState;

const stateCommitGraph = new StateCommitGraph(setStateCommitListener);

const ConnectedCommitGraphDebug = bindComponent(
  connectToState(CommitGraphDebugView, stateCommitGraph, 'commitGraph'),
  { Commit }
);

export {
  StateContainer,
  stateCommitGraph,
  ConnectedCommitGraphDebug as CommitGraphDebug,
  CommitGraphDebugView
};
