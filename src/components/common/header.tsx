import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Header = ({ title }: { title: string }) => {
	return (
		<header className="w-full bg-gray-800 mb-3 border-b border-gray-700">
			<div className="mx-auto py-4 pl-4 pr-4 sm:pr-6 lg:pr-8 flex items-center justify-between">
				<div className="flex items-center gap-2d">
					<SidebarTrigger />
					<h1 className="text-2xl font-semibold text-gray-100">{title}</h1>
				</div>
			</div>
		</header>
	);
};

export default Header;
