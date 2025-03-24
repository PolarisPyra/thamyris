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
import { useAuth } from "@/hooks/auth";

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

// const maimaiSubNav = [
// 	{
// 		name: "Scores",
// 		href: "/maimai/scores",
// 		icon: NotepadText,
// 		color: "#1aaeed",
// 	},
// 	{
// 		name: "Rivals",
// 		href: "/maimai/rivals",
// 		icon: Swords,
// 		color: "#1aaeed",
// 	},
// 	{
// 		name: "Leaderboard",
// 		href: "/maimai/leaderboard",
// 		icon: Trophy,
// 		color: "#1aaeed",
// 	},
// 	{
// 		name: "All Songs",
// 		href: "/maimai/allsongs",
// 		icon: BoomBox,
// 		color: "#1aaeed",
// 	},
// 	{
// 		name: "Rating Frame",
// 		href: "/maimai/rating",
// 		icon: List,
// 		color: "#1aaeed",
// 	},
// ];

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
		name: "SEGA",
		icon: ChevronDown,
		color: "#17569b",
		subnav: [
			{
				name: "Chunithm",
				icon: ChevronDown,
				color: "#e0d531",
				subnav: chunithmSubnav,
			},
			{
				name: "Ongeki",
				icon: ChevronDown,
				color: "#f067e9",
				subnav: ongekiSubnav,
			},
			// {
			// 	name: "Maimai",
			// 	icon: ChevronDown,
			// 	color: "#1aaeed",
			// 	subnav: maimaiSubNav,
			// },
		],
	},
];

export function SidebarComponent() {
	const [openCategories, setOpenCategories] = React.useState<Record<string, boolean>>({});
	const [openSubCategories, setOpenSubCategories] = React.useState<Record<string, boolean>>({});
	const { user } = useAuth();

	const toggleCategory = (categoryName: string) => {
		setOpenCategories((prev) => ({
			...prev,
			[categoryName]: !prev[categoryName],
		}));
	};

	const toggleSubCategory = (categoryName: string, event: React.MouseEvent) => {
		event.stopPropagation();
		setOpenSubCategories((prev) => ({
			...prev,
			[categoryName]: !prev[categoryName],
		}));
	};

	if (!user) return null;

	const userData = {
		username: user.username,
		aimeCardId: user.aimeCardId || "",
		avatar: "",
	};

	return (
		<Sidebar className="text-primary border-sidebar-border border-r">
			<SidebarHeader className="bg-background px-4 py-4">
				<h2 className="text-primary text-2xl font-extrabold">Cozynet</h2>
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
															{subItem.subnav ? (
																<>
																	<SidebarMenuButton
																		className="text-primary hover:bg-hover cursor-pointer ring-0 data-[state=open]:bg-gray-700 data-[state=open]:text-gray-100"
																		onClick={(e) => toggleSubCategory(subItem.name, e)}
																	>
																		<subItem.icon style={{ color: subItem.color }} />
																		<span>{subItem.name}</span>
																	</SidebarMenuButton>
																	{openSubCategories[subItem.name] && (
																		<SidebarMenuSub className="border-none pl-4">
																			{subItem.subnav.map((nestedItem, nestedIndex) => (
																				<SidebarMenuItem key={`${index}-${subIndex}-${nestedIndex}`}>
																					<SidebarMenuButton
																						className="text-primary hover:bg-hover cursor-pointer ring-0 data-[state=open]:bg-gray-700 data-[state=open]:text-gray-100"
																						asChild
																					>
																						<Link to={nestedItem.href}>
																							<nestedItem.icon style={{ color: nestedItem.color }} />
																							<span>{nestedItem.name}</span>
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
																	<subItem.icon style={{ color: subItem.color }} />
																	<span>{subItem.name}</span>
																</SidebarMenuButton>
															)}
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
