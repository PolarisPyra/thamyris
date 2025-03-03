"use client";

import React from "react";

import { useQuery } from "@tanstack/react-query";
import { ChevronsUpDown, LogOut, SettingsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { api } from "@/utils";

export function NavUser({
	user,
}: {
	user: {
		username: string;
		aimeCardId: string;
		avatar: string;
	};
}) {
	const { isMobile } = useSidebar();
	const navigate = useNavigate();

	const { refetch } = useQuery({
		queryKey: ["nav-user-logout"],
		queryFn: async () => api.users.logout.$post(),
		enabled: false,
	});

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="ring-0 hover:bg-gray-700 hover:text-gray-100 data-[state=open]:bg-gray-700 data-[state=open]:text-gray-100"
						>
							<Avatar className="h-8 w-8 rounded-lg bg-gray-700">
								<AvatarImage src={user.avatar} alt={user.username} />
								<AvatarFallback className="rounded-lg bg-gray-700 text-gray-100">
									{user.username.substring(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold text-gray-100">{user.username}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4 text-gray-400" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border border-gray-700 bg-gray-800"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg bg-gray-700">
									<AvatarImage src={user.avatar} alt={user.username} />
									<AvatarFallback className="rounded-lg bg-gray-700 text-gray-100">
										{user.username.substring(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold text-gray-100">{user.username}</span>
									<span className="truncate text-xs text-gray-400">{user.aimeCardId}</span>
								</div>
							</div>
						</DropdownMenuLabel>

						<DropdownMenuSeparator className="bg-gray-700" />
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={() => navigate("/account")}
								className="text-gray-100 focus:bg-gray-700 focus:text-gray-100"
							>
								<SettingsIcon className="text-gray-400" />
								Account
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator className="bg-gray-700" />
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={() => navigate("/settings/ongeki")}
								className="text-gray-100 focus:bg-gray-700 focus:text-gray-100"
							>
								<SettingsIcon className="text-gray-400" />
								Ongeki Settings
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={() => navigate("/settings/chunithm")}
								className="text-gray-100 focus:bg-gray-700 focus:text-gray-100"
							>
								<SettingsIcon className="text-gray-400" />
								Chunithm Settings
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator className="bg-gray-700" />
						<DropdownMenuItem onClick={() => refetch()} className="text-gray-100 focus:bg-gray-700 focus:text-gray-100">
							<LogOut className="text-gray-400" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
