export type TypeProps = 'string' | 'number' | 'boolean' | 'json';

export type TypeMap = {
  string: string | null;
  number: number | null;
  boolean: boolean | null;
  json: Record<string, any> | null;
};
