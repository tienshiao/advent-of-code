
export default class TwoDimArray<T> {
  private data: T[] = [];
  private width = 0;
  private height = 0;
  private default: T;

  constructor(width: number, height: number, def: T) {
    this.width = width;
    this.height = height;
    this.default = def;
  }

  public get(x: number, y: number) {
    return this.data[y * this.width + x] || 0;
  }

  public set(x: number, y: number, value: T) {
    this.data[y * this.width + x] = value;
  }
}
