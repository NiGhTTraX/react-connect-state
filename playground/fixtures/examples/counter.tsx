/* eslint-disable react/no-multi-comp,react/no-access-state-in-setstate */
import React, { Component } from 'react';
import StateContainer from '../../../src/state-container';
import connectToState, { stateCommitGraph } from '../../../src';
import CommitGraph from '../../../src/components/commit-graph';
import Commit from '../../../src/components/commit';

interface CounterState {
  count: number;
}

class CounterStore extends StateContainer<CounterState> {
  state = { count: 1 };

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };
}

interface CounterViewProps {
  counter: CounterStore
}

class CounterView extends Component<CounterViewProps> {
  render() {
    return <div>
      Counter: <span id="count">{this.props.counter.state.count}</span>
      <button type="button" onClick={this.props.counter.increment}>
        Increment me
      </button>
    </div>;
  }
}

const ConnectedCounterView = connectToState(CounterView, new CounterStore(), 'counter');
const ConnectedCommits = connectToState(CommitGraph, stateCommitGraph, 'commitGraph');

class ReplayableCounter extends Component {
  render() {
    return <div style={{ display: 'inline-block' }}>
      <ConnectedCounterView />
      <ConnectedCommits Commit={Commit} />
    </div>;
  }
}

export default {
  component: ReplayableCounter
};
