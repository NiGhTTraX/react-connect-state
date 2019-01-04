export interface StateContainerProps<T> {
  onStateUpdate: (state: T) => void;
}

export default abstract class StateContainer<T> {
  private readonly onStateUpdate: (state: T) => void;

  protected state: T | undefined;

  constructor({ onStateUpdate }: StateContainerProps<T>) {
    this.onStateUpdate = onStateUpdate;
  }

  protected setState(partialState: Partial<T>) {
    this.state = Object.assign({}, this.state, partialState);

    this.onStateUpdate(this.state);
  }
}
