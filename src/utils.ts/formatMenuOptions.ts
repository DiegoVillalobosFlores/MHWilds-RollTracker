import type { Menu } from "../types/Menu";

type MenuOption = {
  command: string;
  displayLabel: string;
  action: () => Promise<Menu>;
  additionalInfo?: Record<string, string>;
} | null;

type MenuDisplayOption = {
  Shortcut: string;
  Options: string;
  [key: string]: string;
};

type MenuHandler = Record<string | number, () => Promise<Menu>>;

export default function formatMenuOptions(options: MenuOption[]): {
  menu: Record<string | number, MenuDisplayOption>;
  handler: MenuHandler;
} {
  const filteredOptions = options.filter((option) => option !== null);

  return filteredOptions.reduce(
    (acc, option, index) => {
      return {
        menu: {
          ...acc.menu,
          [`${index + 1}`]: {
            Shortcut: option.command,
            Options: option.displayLabel,
            ...(option.additionalInfo ? option.additionalInfo : {}),
          },
        },
        handler: {
          ...acc.handler,
          [index + 1]: option.action,
          [option.command]: option.action,
        },
      };
    },
    {
      menu: {},
      handler: {},
    },
  );
}
