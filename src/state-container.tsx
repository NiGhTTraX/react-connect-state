type Listener = () => void;

export default abstract class StateContainer<T> {
  private listeners: Listener[] = [];

  state: T | undefined;

  protected setState(partialState: Partial<T>) {
    this.state = Object.assign({}, this.state, partialState);

    this.listeners.forEach(listener => listener());
  }

  public addListener(listener: Listener) {
    this.listeners.push(listener);
  }
}
