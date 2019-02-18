/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import connectToState, { CommitGraphDebug } from '../../../src';
import StateContainer from '../../../src/state-container';

interface TodosState {
  todos: string[];
  typingTodo: string;
}

class Todos extends StateContainer<TodosState> {
  state = { todos: [], typingTodo: '' };

  addTodo = () => {
    if (!this.state.typingTodo) {
      return;
    }
    this.setState({
      todos: [...this.state.todos, this.state.typingTodo],
      typingTodo: ''
    });
  };

  onTypeTodo = (name: string) => {
    this.setState({ typingTodo: name });
  };
}

const TodosView = ({ todos }: { todos: Todos }) => <div>
  Add new todo:
  <input type="text" value={todos.state.typingTodo}
    onChange={e => todos.onTypeTodo(e.target.value)}
  />
  <button type="button" onClick={todos.addTodo}>Add</button>
  <ul id="todos">
    {/* eslint-disable-next-line react/no-array-index-key */}
    {todos.state.todos.map((todo, i) => <li className="todo" key={i}>
      {todo}
    </li>)}
  </ul>
</div>;

const ConnectedTodos = connectToState(TodosView, new Todos(), 'todos');

class ReplayableTodos extends Component {
  render() {
    return <div style={{ display: 'inline-block' }}>
      <ConnectedTodos />
      <CommitGraphDebug />
    </div>;
  }
}

export default {
  component: ReplayableTodos
};
