type Listener = () => void;

export default abstract class StateContainer<T> {
  private listeners: Listener[] = [];

  // This can result in runtime errors if the derived class doesn't
  // initialize the state. TODO: how can we prevent this?
  state!: T;

  protected setState(partialState: Partial<T>) {
    this.state = Object.assign({}, this.state, partialState);

    this.listeners.forEach(listener => listener());
  }

  public addListener(listener: Listener) {
    this.listeners.push(listener);
  }
}
