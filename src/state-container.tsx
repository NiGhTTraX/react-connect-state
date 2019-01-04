export default abstract class StateContainer<T> {
  private _onStateUpdate: (state: T) => void = () => {};

  set onStateUpdate(value: (state: T) => void) {
    this._onStateUpdate = value;
  }

  protected state: T | undefined;

  protected setState(partialState: Partial<T>) {
    this.state = Object.assign({}, this.state, partialState);

    this._onStateUpdate(this.state);
  }
}
