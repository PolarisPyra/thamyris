"use client";

import React from "react";

import { ChevronsUpDown, LogOut, Monitor, SettingsIcon, UserCog } from "lucide-react";
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
import { useAuth } from "@/hooks/auth";

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
	const { logout } = useAuth();
	const navigate = useNavigate();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="hover:bg-hover data-[state=open]:bg-hover data-[state=open]:text-primary ring-0"
						>
							<Avatar className="bg-background h-8 w-8 rounded-lg">
								<AvatarImage src={user.avatar} alt={user.username} />
								<AvatarFallback className="bg-background text-primary rounded-lg">
									{user.username.substring(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="text-primary truncate font-semibold">{user.username}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4 text-gray-400" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="bg-background border-sidebar-border w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="bg-background h-8 w-8 rounded-lg">
									<AvatarImage src={user.avatar} alt={user.username} />
									<AvatarFallback className="text-primary bg-background rounded-lg">
										{user.username.substring(0, 2).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="text-primary truncate font-semibold">{user.username}</span>
									<span className="text-primary truncate text-xs">{user.aimeCardId}</span>
								</div>
							</div>
						</DropdownMenuLabel>

						<DropdownMenuSeparator className="bg-border" />
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={() => navigate("/arcade")}
								className="text-primary focus:bg-hover focus:text-primary hover:cursor-pointer"
							>
								<Monitor className="text-primary" />
								Arcade Management
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => navigate("/account")}
								className="text-primary focus:bg-hover focus:text-primary hover:cursor-pointer"
							>
								<UserCog className="text-primary" />
								Account Settings
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator className="bg-border" />
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={() => navigate("/settings/ongeki")}
								className="text-primary focus:bg-hover focus:text-primary hover:cursor-pointer"
							>
								<SettingsIcon className="text-primary`" />
								Ongeki Settings
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={() => navigate("/settings/chunithm")}
								className="text-primary focus:bg-hover focus:text-primary hover:cursor-pointer"
							>
								<SettingsIcon className="text-primary" />
								Chunithm Settings
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator className="bg-border" />
						<DropdownMenuItem
							onClick={logout}
							className="text-primary focus:bg-hover focus:text-primary hover:cursor-pointer"
						>
							<LogOut className="text-primary" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
