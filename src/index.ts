import bindComponent from 'react-bind-component';
import connectToState from './connect';
import StateContainer, { setStateCommitListener } from './state-container';
import StateCommitGraph from './commit-graph';
import CommitGraphDebugView from './components/commit-graph-debug';
import Commit from './components/commit';
import Tooltip from '@material-ui/core/Tooltip';

export default connectToState;

const stateCommitGraph = new StateCommitGraph(setStateCommitListener);

const ConnectedCommitGraphDebug = bindComponent(
  connectToState(CommitGraphDebugView, { commitGraph: stateCommitGraph }),
  { Commit: bindComponent(Commit, { Tooltip }) }
);

export {
  StateContainer,
  stateCommitGraph,
  ConnectedCommitGraphDebug as CommitGraphDebug,
  CommitGraphDebugView
};
