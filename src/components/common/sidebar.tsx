import React from "react";

import {
	BoomBox,
	ChevronDown,
	HeartIcon,
	Home,
	List,
	Newspaper,
	NotepadText,
	Pencil,
	Swords,
	Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/auth/use-auth";

import { NavUser } from "./nav-user";

const chunithmSubnav = [
	{
		name: "Scores",
		href: "/chunithm/scores",
		icon: NotepadText,
		color: "#e0d531",
	},
	{
		name: "Userbox",
		icon: Pencil,
		color: "#e0d531",
		href: "/chunithm/userbox",
	},
	{
		name: "Favorites",
		href: "/chunithm/favorites",
		icon: HeartIcon,
		color: "#e0d531",
	},
	{
		name: "Rivals",
		href: "/chunithm/rivals",
		icon: Swords,
		color: "#e0d531",
	},
	{
		name: "Leaderboard",
		href: "/chunithm/leaderboard",
		icon: Trophy,
		color: "#e0d531",
	},
	{
		name: "All Songs",
		href: "/chunithm/allsongs",
		icon: BoomBox,
		color: "#e0d531",
	},
	{
		name: "Rating Frame",
		href: "/chunithm/rating",
		icon: List,
		color: "#e0d531",
	},
];

const ongekiSubnav = [
	{
		name: "Scores",
		href: "/ongeki/scores",
		icon: NotepadText,
		color: "#f067e9",
	},
	{
		name: "Rivals",
		href: "/ongeki/rivals",
		icon: Swords,
		color: "#f067e9",
	},
	{
		name: "Leaderboard",
		href: "/ongeki/leaderboard",
		icon: Trophy,
		color: "#f067e9",
	},
	{
		name: "All Songs",
		href: "/ongeki/allsongs",
		icon: BoomBox,
		color: "#f067e9",
	},
	{
		name: "Rating Frame",
		href: "/ongeki/rating",
		icon: List,
		color: "#f067e9",
	},
];

const sidebarItems = [
	{
		name: "Home",
		icon: Home,
		color: "#6366f1",
		href: "/overview",
	},
	{
		name: "News",
		icon: Newspaper,
		color: "#8B5CF6",
		href: "/news",
	},
	{
		name: "Chunithm",
		icon: ChevronDown,
		color: "#59ba22",
		subnav: chunithmSubnav,
	},
	{
		name: "Ongeki",
		icon: ChevronDown,
		color: "#59ba22",
		subnav: ongekiSubnav,
	},
];

export function SidebarComponent() {
	const [openCategories, setOpenCategories] = React.useState<Record<string, boolean>>({});
	const { user } = useAuth();

	const toggleCategory = (categoryName: string) => {
		setOpenCategories((prev) => ({
			...prev,
			[categoryName]: !prev[categoryName],
		}));
	};

	if (!user) return null;

	const userData = {
		username: user.username,
		aimeCardId: user.aimeCardId,
		avatar: "",
	};

	return (
		<Sidebar className="text-primary border-sidebar-border border-r">
			<SidebarHeader className="bg-background px-4 py-4">
				<h2 className="text-primary text-2xl font-extrabold">Thamyris</h2>
			</SidebarHeader>
			<SidebarContent className="bg-background">
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{sidebarItems.map((item, index) => (
								<SidebarMenuItem key={index}>
									{item.subnav ? (
										<>
											<SidebarMenuButton
												className="text-primary hover:bg-hover data-[state=open]:bg-card data-[state=open]:text-primary cursor-pointer ring-0"
												onClick={() => toggleCategory(item.name)}
											>
												<item.icon style={{ color: item.color }} />
												<span>{item.name}</span>
											</SidebarMenuButton>
											{openCategories[item.name] && (
												<SidebarMenuSub className="border-none">
													{item.subnav.map((subItem, subIndex) => (
														<SidebarMenuItem key={`${index}-${subIndex}`}>
															<SidebarMenuButton
																className="text-primary hover:bg-hover cursor-pointer ring-0 data-[state=open]:bg-gray-700 data-[state=open]:text-gray-100"
																asChild
															>
																<Link to={subItem.href}>
																	<subItem.icon style={{ color: subItem.color }} />
																	<span>{subItem.name}</span>
																</Link>
															</SidebarMenuButton>
														</SidebarMenuItem>
													))}
												</SidebarMenuSub>
											)}
										</>
									) : (
										<SidebarMenuButton
											className="text-primary hover:bg-hover cursor-pointer ring-0 data-[state=open]:bg-gray-700 data-[state=open]:text-gray-100"
											asChild
										>
											<Link to={item.href}>
												<item.icon style={{ color: item.color }} />
												<span>{item.name}</span>
											</Link>
										</SidebarMenuButton>
									)}
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="bg-background border-sidebar-border border-t">
				<NavUser user={userData} />
			</SidebarFooter>
		</Sidebar>
	);
}
