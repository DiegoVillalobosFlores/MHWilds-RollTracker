import type { Renderer } from "../types/Renderer";

export default {
  line: (text: string): void => console.log(text),
  table: (data: unknown): void => console.table(data),
} as Renderer;
