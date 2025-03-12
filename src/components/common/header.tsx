import React from "react";

import { SidebarTrigger } from "@/components/ui/sidebar";

import { ModeToggle } from "./theme-switcher";

const Header = ({ title }: { title: string }) => {
	return (
		<header className="bg-background border-sidebar-border sticky top-0 z-50 mb-3 w-full border-b">
			<div className="mx-auto flex items-center justify-between py-4 pr-4 pl-4 sm:pr-6 lg:pr-8">
				<div className="text-primary flex items-center gap-2">
					<SidebarTrigger className="hover:bg-hover" />
					<h1 className="text-primary text-2xl font-semibold">{title}</h1>
				</div>
				<ModeToggle />
			</div>
		</header>
	);
};

export default Header;
