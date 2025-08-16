import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Users,
  FileText,
  Tags,
  FolderOpen,
  Mail,
  BarChart3,
  Shield,
  Home
} from "lucide-react"

import { NavMain } from "~/components/nav-main"
import { NavProjects } from "~/components/nav-projects"
import { NavUser } from "~/components/nav-user"
import { TeamSwitcher } from "~/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar"

// This is sample data.
  // route("admin", "routes/admin/_layout.tsx", [
  //   route("", "routes/admin/index.tsx"),
  //   route("analytics", "routes/admin/analytics.tsx"),
  //   route("users", "routes/admin/users.tsx"),
  //   route("roles", "routes/admin/roles.tsx"),
  //   route("categories", "routes/admin/categories.tsx"),
  //   route("tags", "routes/admin/tags.tsx"),
  //   route("newsletter", "routes/admin/newsletter.tsx"),
  //   route("settings", "routes/admin/settings.tsx"),
  // ]),
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Tổng quan",
      url: "/admin",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/admin",
        },
        {
          title: "Thống kê",
          url: "/admin/analytics",
        },
      ],
    },
    {
      title: "Quản lý nội dung",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "Danh mục",
          url: "/admin/categories",
        },
        {
          title: "Thẻ",
          url: "/admin/tags",
        },
      ],
    },
    {
      title: "Quản lý người dùng",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Người dùng",
          url: "/admin/users",
        },
        {
          title: "Vai trò",
          url: "/admin/roles",
        },
      ],
    },
    {
      title: "Marketing",
      url: "#",
      icon: Mail,
      items: [
        {
          title: "Newsletter",
          url: "/admin/newsletter",
        },
      ],
    },
    {
      title: "Cài đặt",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Cài đặt hệ thống",
          url: "/admin/settings",
        },
      ],
    },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
  
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
