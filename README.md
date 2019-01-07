> Connect state containers to React views in a type safe an dead simple way

[![Build Status](https://travis-ci.com/NiGhTTraX/react-state-connect.svg?branch=master)](https://travis-ci.com/NiGhTTraX/react-state-connect)
[![codecov](https://codecov.io/gh/NiGhTTraX/react-state-connect/branch/master/graph/badge.svg)](https://codecov.io/gh/NiGhTTraX/react-state-connect)

----

## Usage

```tsx
import connectToState, { StateContainer } from 'react-state-connect';

interface CounterState {
  count: number;
}

class CounterContainer extends StateContainer<CounterState> {
  state = {
    count: 0
  };

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  decrement() {
    this.setState({ count: this.state.count - 1 });
  }
}

interface CounterViewProps {
  counter: StateContainer<CounterState>;
}

const CounterView = (({ counter }): CounterViewProps) => <div>
  <button onClick={() => counter.decrement()}>-</button>
  <span>{counter.state.count}</span>
  <button onClick={() => counter.increment()}>+</button>
</div>;

const ConnectedCounterView = connectToState(
  CounterView,
  new CounterContainer()
);

ReactDOM.render(
  <ConnectedCounterView />,
  document.getElementById('root')
);
```


## Guiding principles

### Type safety

This lib is written in TypeScript and it makes sure that when you connect
a view to a state container the view will have a prop interface accepting
that type of container.

```tsx
interface ViewProps {
  foo: StateContainer<SomeState>;
}
const View = (props: ViewProps) => null;

class Container extends StateContainer<ADifferentState> {}
const container = new Container();

// Will throw a compiler error because `View` does not accept `ADifferentState`.
connectToState(View, container, 'foo');

// Will throw a compiler error because `View` does not accept `bar`.
connectToState(View, container, 'bar');
```

### Dependency Injection

There is no automagic `<Provider>` to wire up your container and views,
everything is up to you: when you instantiate your containers, how many of
them you create and who you pass them to. If you want to have a singleton
container then you just create it once and pass the same reference to
everyone. This style of DI prefers to have everything wired up in your
app root, rather than inlined in the components. This leads to increased
reusability because the views will not be tied to a particular framework.

```tsx
const singletonContainer = new SingletonContainer();

// We're passing the same instance to different views, but we could also
// pass new instances every time.
connectToState(SomeView, singletonContainer, 'foo'); 
connectToState(AnotherView, singletonContainer, 'bar');
```

### Keep It Simple

`setState` is synchronous because we're not doing any batching like in React.
Moreover, the views receive the container directly under the specified prop,
there's no need to create an intermediary component that accepts only the
container and passes it along to the real view.


## More examples

### Connecting multiple containers

You can chain multiple `connectToState` calls to connect multiple containers.

```tsx
interface ViewProps {
  foo: ContainerState<State1>,
  bar: ContainerState<State2>,
}

const View = ({ foo, bar }: ViewProps) => <div>...</div>;

const ConnectedView = connectToState(
  connectToState(View, container1, 'foo'),
  container2,
  'bar'
);

ReactDOM.render(<ConnectedView />);
```

Making `connectToState` accept an array of containers is a bit hard
to type without something like
[TypeScript#5453](https://github.com/Microsoft/TypeScript/issues/5453).
An option would be to manually type overrides for up to a number of
containers, but that doesn't seem right, at least not at the moment.

### Exporting a connected component

You can of course connect a view to a container when exporting it from
a module.

```tsx
import connectToState, { StateContainer } from 'react-state-connect';
import CounterContainer from './counter-container';

interface CounterViewProps {
  counter: CounterContainer
}

const CounterView = (({ counter }): CounterViewProps) => <div>...</div>;

export default connectToState(
  CounterView,
  new CounterContainer()
);
```

This pattern is perfectly valid, though it couples the view to the
state container so it can't be used without it. This increases "out of
the box readyness" at the expense of loose coupling.

### Connecting a component inline

```tsx
import connectToState, { StateContainer } from 'react-state-connect';
import container from './container';
import View from './view';

// Connect the view once, outside your render method.
const ConnectedView = connectToState(View, container, 'foo');

export default () => <div>
  <ConnectedView />
</div>;
```
