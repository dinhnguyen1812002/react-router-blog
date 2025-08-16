import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  LogOut,
  Settings,
  User,
  Shield,
  Crown,
  Star,
} from "lucide-react"
import { Link, useNavigate } from "react-router"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { useAuthStore } from "~/store/authStore"
import { useAuth } from "~/hooks/useAuth"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user } = useAuthStore()
  const { logout } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return null
  }

  // Get user role display
  const getUserRole = () => {
    if (user.roles.includes('ADMIN')) return { label: 'Admin', icon: Crown, color: 'text-yellow-600' }
    if (user.roles.includes('MODERATOR')) return { label: 'Moderator', icon: Shield, color: 'text-blue-600' }
    if (user.roles.includes('AUTHOR')) return { label: 'Tác giả', icon: Star, color: 'text-purple-600' }
    return { label: 'Thành viên', icon: User, color: 'text-gray-600' }
  }

  const userRole = getUserRole()
  const RoleIcon = userRole.icon

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (user.username) {
      return user.username.charAt(0).toUpperCase()
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar || undefined} alt={user.username} />
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.username}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar || undefined} alt={user.username} />
                  <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.username}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  <div className="flex items-center gap-1 mt-1">
                    <RoleIcon className={`w-3 h-3 ${userRole.color}`} />
                    <span className={`text-xs font-medium ${userRole.color}`}>
                      {userRole.label}
                    </span>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/profile" className="cursor-pointer">
                  <User className="w-4 h-4" />
                  Hồ sơ cá nhân
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings" className="cursor-pointer">
                  <Settings className="w-4 h-4" />
                  Cài đặt
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/bookmarks" className="cursor-pointer">
                  <BadgeCheck className="w-4 h-4" />
                  Bài viết đã lưu
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="w-4 h-4" />
                Thông báo
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}