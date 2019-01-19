type Listener<T> = (state: T) => void;

export default abstract class StateContainer<T> {
  private listeners: Listener<T>[] = [];

  // This can result in runtime errors if the derived class doesn't
  // initialize the state. TODO: how can we prevent this?
  state!: T;

  protected setState(partialState: Partial<T>) {
    this.state = Object.assign({}, this.state, partialState);

    this.listeners.forEach(listener => listener(this.state));
  }

  public addListener(listener: Listener<T>) {
    this.listeners.push(listener);
  }
}
