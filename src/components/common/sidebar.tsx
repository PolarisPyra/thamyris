import React from "react";

import {
  BoomBox,
  ChevronDown,
  CircleArrowRight,
  HeartIcon,
  Home,
  List,
  Newspaper,
  NotepadText,
  Pencil,
  Swords,
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
import { useAuth } from "@/context/auth-provider";
import { useChunithmVersion } from "@/hooks/chunithm/use-version";

import { NavUser } from "./nav-user";

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
  {
    name: "Rating Frame",
    href: "/chunithm/rating",
    icon: List,
    color: "#e0d531",
  },
];

const baseOngekiSubnav = [
  {
    name: "Scores",
    href: "/ongeki/scores",
    icon: NotepadText,
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

  {
    name: "Potential Rating",
    href: "/ongeki/potential",
    icon: CircleArrowRight,
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
    subnav: [], // Will be populated dynamically
  },
  {
    name: "Ongeki",
    icon: ChevronDown,
    color: "#59ba22",
    subnav: baseOngekiSubnav,
  },
];

export function SidebarComponent() {
  const [openCategories, setOpenCategories] = React.useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const { data: version } = useChunithmVersion();

  // Dynamically construct Chunithm subnav based on version
  const chunithmSubnav = React.useMemo(() => {
    const subnav = [...baseChunithmSubnav];

    // Add Potential ratings only for version 17 and above
    if (version && version >= 17) {
      subnav.push({
        name: "Potential Rating",
        href: "/chunithm/potential",
        icon: CircleArrowRight,
        color: "#e0d531",
      });
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
    <Sidebar className="border-r border-gray-700 bg-gray-800 text-white shadow-lg">
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
                        className="text-gray-100 ring-0 hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700 active:text-white data-[state=open]:bg-gray-700 data-[state=open]:text-gray-100"
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
                                className="text-gray-100 ring-0 hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700 active:text-white data-[state=open]:bg-gray-700 data-[state=open]:text-gray-100"
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
                      className="text-gray-100 ring-0 hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700 active:text-white data-[state=open]:bg-gray-700 data-[state=open]:text-gray-100"
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
      <SidebarFooter className="border-t border-gray-700 bg-gray-800">
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
