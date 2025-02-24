import React from "react";
import {
	Home,
	Newspaper,
	ChevronDown,
	Swords,
	NotepadText,
	HeartIcon,
	Pencil,
	BoomBox,
	Trophy,
	List,
	ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarMenuSub,
	SidebarFooter,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { useAuth } from "@/context/auth-provider";
import { useChunithmVersion } from "@/hooks/chunithm/use-version";

const baseChunithmSubnav = [
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
		name: "All Songs",
		href: "/chunithm/allsongs",
		icon: BoomBox,
		color: "#e0d531",
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
		subnav: [], // Will be populated dynamically
	},
	{
		name: "Ongeki",
		icon: ChevronDown,
		color: "#59ba22",
		subnav: [
			{
				name: "Scores",
				href: "/ongeki/scores",
				icon: NotepadText,
				color: "#da31e0",
			},
			{
				name: "All Songs",
				href: "/ongeki/allsongs",
				icon: BoomBox,
				color: "#da31e0",
			},
			{
				name: "Best 30",
				href: "/ongeki/rating-base-best-list",
				icon: Trophy,
				color: "#da31e0",
			},
			{
				name: "Hot List",
				href: "/ongeki/rating-base-hot-list",
				icon: Trophy,
				color: "#da31e0",
			},
			{
				name: "New Best",
				href: "/ongeki/rating-base-new-best-list",
				icon: Trophy,
				color: "#da31e0",
			},
		],
	},
];

export function SidebarComponent() {
	const [openCategories, setOpenCategories] = React.useState<Record<string, boolean>>({});
	const { user } = useAuth();
	const { data: version } = useChunithmVersion();

	// Dynamically construct Chunithm subnav based on version
	const chunithmSubnav = React.useMemo(() => {
		const subnav = [...baseChunithmSubnav];

		// Add Rating Frame for version 16 and 17
		if (version && version >= 16) {
			subnav.push({
				name: "Rating Frame",
				href: "/chunithm/rating-base-list",
				icon: List,
				color: "#e0d531",
			});
		}

		// Add Hot and Potential ratings only for version 17 and above
		if (version && version >= 17) {
			subnav.push(
				{
					name: "Rating Frame Hot",
					href: "/chunithm/rating-base-hot-list",
					icon: Trophy,
					color: "#e0d531",
				},
				{
					name: "Potential Rating",
					href: "/chunithm/rating-base-next-list",
					icon: ArrowRight,
					color: "#e0d531",
				}
			);
		}

		return subnav;
	}, [version]);

	// Update sidebarItems with dynamic Chunithm subnav
	const currentSidebarItems = React.useMemo(() => {
		return sidebarItems.map((item) => {
			if (item.name === "Chunithm") {
				return { ...item, subnav: chunithmSubnav };
			}
			return item;
		});
	}, [chunithmSubnav]);

	const toggleCategory = (categoryName: string) => {
		setOpenCategories((prev) => ({
			...prev,
			[categoryName]: !prev[categoryName],
		}));
	};

	if (!user) return null;

	const userData = {
		name: user.username,
		aimeCardId: user.aimeCardId,
		avatar: "",
	};

	return (
		<Sidebar className="bg-gray-800 text-white border-r border-gray-700 shadow-lg">
			<SidebarHeader className="bg-gray-800 px-4 py-4">
				<h2 className="text-2xl font-extrabold text-white">Thamyris</h2>
			</SidebarHeader>
			<SidebarContent className="bg-gray-800">
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{currentSidebarItems.map((item, index) => (
								<SidebarMenuItem key={index}>
									{item.subnav ? (
										<>
											<SidebarMenuButton
												className="data-[state=open]:bg-gray-700 data-[state=open]:text-gray-100 hover:bg-gray-700 active:bg-gray-700 active:text-white hover:text-gray-100 text-gray-100 ring-0"
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
																className="data-[state=open]:bg-gray-700 data-[state=open]:text-gray-100 hover:bg-gray-700 active:bg-gray-700 active:text-white hover:text-gray-100 text-gray-100 ring-0"
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
											className="data-[state=open]:bg-gray-700 data-[state=open]:text-gray-100 hover:bg-gray-700 active:bg-gray-700 active:text-white hover:text-gray-100 text-gray-100 ring-0"
											asChild
										>
											<Link to={item.href}>
												<item.icon style={{ color: item.color }} />
												<span className="">{item.name}</span>
											</Link>
										</SidebarMenuButton>
									)}
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="bg-gray-800 border-t border-gray-700">
				<NavUser user={userData} />
			</SidebarFooter>
		</Sidebar>
	);
}
