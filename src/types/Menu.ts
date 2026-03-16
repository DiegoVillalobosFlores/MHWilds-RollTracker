import type { Renderer } from "./Renderer";

export type Menu = {
  parseInput(line: string): Promise<Menu>;
  render(renderer: Renderer): Promise<void>;
};
