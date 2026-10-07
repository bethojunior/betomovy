export interface IState {
  addItemList(listName: string, item: string): Promise<void>;
  getList(listName: string): Promise<string[]>;
  del(key: string): Promise<void>;
  set(key: string, value: string, ttl: number): Promise<void>;
  get(key: string): Promise<string | null>;
}
