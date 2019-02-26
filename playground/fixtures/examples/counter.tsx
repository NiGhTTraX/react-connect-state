/* eslint-disable react/no-multi-comp,react/no-access-state-in-setstate */
import React, { Component } from 'react';
import StateContainer from '../../../src/state-container';
import connectToState, { CommitGraphDebug, stateCommitGraph } from '../../../src';

interface CounterState {
  count: number;
}

class CounterStore extends StateContainer<CounterState> {
  state = { count: 1 };

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  reset = () => {
    this.setState({ count: 1 });
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

const counterStore = new CounterStore();
const ConnectedCounterView = connectToState(CounterView, { counter: counterStore });

class ReplayableCounter extends Component {
  render() {
    return <div style={{ display: 'inline-block' }}>
      <ConnectedCounterView />
      <CommitGraphDebug />
    </div>;
  }

  componentWillUnmount() {
    counterStore.reset();
    stateCommitGraph.reset();
  }
}

export default {
  component: ReplayableCounter
};
