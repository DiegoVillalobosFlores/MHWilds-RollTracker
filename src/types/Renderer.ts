export type Renderer = {
  line: (...args: any[]) => void;
  table: (...args: any[]) => void;
  error: (...args: any[]) => void;
};
