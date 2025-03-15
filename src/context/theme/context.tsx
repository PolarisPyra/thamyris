import { createContext } from "react";

import { Theme } from "@/types/enums";

export type ThemeContextValue = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextValue>({ theme: Theme.System, setTheme: () => null });
