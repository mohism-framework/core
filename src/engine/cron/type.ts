export interface ICronexpr {
  name: string;
  expr: string;
  func: Function;
  immediate?: boolean;
}
