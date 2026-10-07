export default class Logger {
  private name = Logger.name;

  constructor(name: string) {
    this.name = name ?? Logger.name;
  }

  log(...args: any[]) {
    if (__DEV__) {
      console.log(`[${this.name}]:`, ...args);
    }
  }
}
