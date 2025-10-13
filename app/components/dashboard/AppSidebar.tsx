import { Home, FileText, PenSquare, FolderOpen, BarChart3, Settings, User, PlusCircle, Bookmark, BookOpen } from "lucide-react";
import { NavLink } from "react-router";


import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";

  const navItems = [
    { title: "Tổng quan", url: "/dashboard", icon: Home },
    { title: "Bài viết của tôi", url: "/dashboard/my-posts", icon: FileText },
    { title: "Viết bài mới", url: "/dashboard/posts/new", icon: PlusCircle },
    { title: "Series", url: "/dashboard/series", icon: BookOpen },
    { title: "Bài viết đã lưu", url: "/dashboard/bookmarks", icon: Bookmark },
    { title: "Thống kê", url: "/dashboard/analytics", icon: BarChart3 },
    { title: "Hồ sơ", url: "/dashboard/profile", icon: User  },
    { title: "Cài đặt", url: "/dashboard/settings", icon: Settings },
  ];
const settingsItems = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar1() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="px-3 py-4">
          <h2 className={`font-bold text-xl transition-opacity ${open ? "opacity-100" : "opacity-0"}`}>
            BlogPlatform
          </h2>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url}
                      end={item.url === "/"}
                      className={({ isActive }) => 
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => 
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
