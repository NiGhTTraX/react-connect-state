import connectToState from './connect';
import StateContainer, { setStateCommitListener } from './state-container';
import StateCommitGraph from './commit-graph';

export default connectToState;

const stateCommitGraph = new StateCommitGraph(setStateCommitListener);

export { StateContainer, stateCommitGraph };
