
import { useState, useEffect } from "react"

import {
  Menu, X, Search, Bell, User,
  LogOut, Settings, Heart, Moon, Sun, PenSquare, PanelsLeftBottom
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { Link } from "react-router"
import { ThemeSwitch } from "../ui/ThemeToggle"
import { useAuthStore } from "~/store/authStore"
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/Avatar"
import { NotificationCenter } from "../notification/NotificationCenter"


import BoringAvatar from "boring-avatars";

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)


  const { user } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setIsDarkMode(isDark)
  }, [])



  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Articles", href: "/articles" },
    { label: "Categories", href: "/categories" },
    { label: "About", href: "/about" },
  ]


  const userMenuItems = [
    { label: "Profile", icon: User, href: `/profile/${user?.username}` },
    { label: "Dashboard", icon: PanelsLeftBottom, href: "/dashboard" },
    { label: "Admin", icon: Settings, href: "/admin" },

  ]


  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${isScrolled ? "shadow-md" : ""
        }`}
    >
      <nav className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-14" : "h-16"}`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              ✦
            </div>
            <span className="hidden sm:inline">BlogHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-32"
              />
            </div>

            {/* Search Icon - Mobile */}
            <Button variant="ghost" size="icon" className="hidden sm:flex lg:hidden" aria-label="Search">
              <Search className="w-5 h-5" />
            </Button>


            <NotificationCenter />

            <ThemeSwitch />

            {user ? (
              <>
                <Link to="/dashboard/article" className="hidden sm:block">
                  <Button className="gap-2 border border-dashed border-primary" variant="ghost">
                    <PenSquare className="w-4 h-4" />
                    <span className="hidden md:inline">Write</span>
                  </Button>
                </Link>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full p-0 h-8 w-8"
                    aria-label="User profile"
                    onClick={() => {
                      setIsUserDropdownOpen(!isUserDropdownOpen)
                      setIsNotificationDropdownOpen(false)
                    }}
                  >
                    {user.avatar ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback>{user.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <BoringAvatar name={user.username}
                        variant="beam"
                        size={100}
                        colors={['#FF5733', '#FFC300', '#DAF7A6']}
                      />
                    )}
                  </Button>

                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                      <div className="p-4 border-b border-border">
                        <p className="font-semibold text-foreground">{user?.username}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        {userMenuItems.map((item) => {
                          const Icon = item.icon
                          return (
                            <Link
                              key={item.label}
                              to={item.href}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                              onClick={() => setIsUserDropdownOpen(false)}
                            >
                              <Icon className="w-4 h-4" />
                              {item.label}
                            </Link>
                          )
                        })}
                        <Link to="/logout" className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden md:block">
                  <Button variant="ghost">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register" className="hidden md:block">
                  <Button className="gap-2 bg-primary hover:bg-primary/90">
                    Đăng ký
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2 animate-in fade-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="block px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 py-2">
              <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="bg-transparent text-sm outline-none placeholder:text-muted-foreground w-full"
                />
              </div>
            </div>
            <Link to="/write" className="block sm:hidden px-4 py-2">
              <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
                <PenSquare className="w-4 h-4" />
                Write Article
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
