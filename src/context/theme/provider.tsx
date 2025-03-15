import React, { useMemo } from "react";
import { useEffect, useState } from "react";

import { Theme } from "@/types/enums";

import { ThemeContext } from "./context";

export type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

export function ThemeProvider({
	children,
	defaultTheme = Theme.Dark,
	storageKey = "vite-ui-theme",
	...props
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme);

	useEffect(() => {
		const root = window.document.documentElement;
		root.classList.remove("light", "dark");

		let newTheme = theme;
		if (theme === Theme.System) {
			newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? Theme.Dark : Theme.Light;
		}
		root.classList.add(newTheme);
	}, [theme]);

	const value = useMemo(
		() => ({
			theme,
			setTheme: (theme: Theme) => {
				localStorage.setItem(storageKey, theme);
				setTheme(theme);
			},
		}),
		[theme]
	);

	return (
		<ThemeContext.Provider {...props} value={value}>
			{children}
		</ThemeContext.Provider>
	);
}
