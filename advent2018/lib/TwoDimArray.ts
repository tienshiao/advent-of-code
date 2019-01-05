
export default class TwoDimArray<T> {
  public data: T[] = [];
  public width = 0;
  public height = 0;
  public default: T;

  constructor(width: number, height: number, def: T) {
    this.width = width;
    this.height = height;
    this.default = def;
  }

  public get(x: number, y: number) {
    return this.data[y * this.width + x] || this.default;
  }

  public set(x: number, y: number, value: T) {
    this.data[y * this.width + x] = value;
  }
}
