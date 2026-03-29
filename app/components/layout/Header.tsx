import BoringAvatar from "boring-avatars";

import {
	Bell,
	Heart,
	LogOut,
	Menu,
	Moon,
	PanelsLeftBottom,
	PenSquare,
	Search,
	Settings,
	Sun,
	User,
	X,
} from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { useAuthContext } from "~/context/AuthContext";
import { resolveAvatarUrl } from "~/utils/image";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { ScrollProgress } from "../ui/scroll-progress";

const NotificationCenter = lazy(() =>
	import("../notification/NotificationCenter").then((mod) => ({
		default: mod.NotificationCenter,
	})),
);
const GlobalSearch = lazy(() =>
	import("~/components/search/GlobalSearch").then((mod) => ({
		default: mod.GlobalSearch,
	})),
);

// Create a wrapper component for BoringAvatar to ensure proper hook usage
const UserAvatar = ({ username }: { username: string }) => {
	return (
		<div className="w-8 h-8 rounded-full overflow-hidden">
			<BoringAvatar
				name={username}
				variant="beam"
				size={32}
				colors={["#FF5733", "#FFC300", "#DAF7A6"]}
			/>
		</div>
	);
};

export function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
	const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
		useState(false);
	const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

	const { user, logout } = useAuthContext();

	const handleLogout = async () => {
		await logout();
		setIsUserDropdownOpen(false);
	};

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Close mobile search when menu closes
	useEffect(() => {
		if (!isOpen) setIsMobileSearchOpen(false);
	}, [isOpen]);

	const navLinks = [
		{ label: "Home", href: "/" },
		{ label: "Articles", href: "/articles" },
		{ label: "Categories", href: "/categories" },
		{ label: "About", href: "/about" },
	];

	const userMenuItems = [
		{ label: "Profile", icon: User, href: `/profile/${user?.slug}` },
		{ label: "Dashboard", icon: PanelsLeftBottom, href: "/dashboard" },
		...(user?.roles?.includes("ROLE_ADMIN")
			? [{ label: "Admin", icon: Settings, href: "/admin" }]
			: []),
	];

	return (
		<>
			<header
				className={`sticky top-0 z-50 w-full border-b border-border
           bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 
           transition-all duration-300`}
			>
				<nav className="mx-auto container px-4 sm:px-6 lg:px-8">
					<div
						className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? "h-14" : "h-16"}`}
					>
						{/* Logo */}
						<Link
							to="/"
							className="flex items-center gap-2 font-bold text-xl text-primary 
          shrink-0"
						>
							<div className="flex items-center space-x-2 cursor-pointer">
								<div className="w-8 h-8 bg-black flex items-center justify-center">
									<span className="text-white font-bold text-lg">I</span>
								</div>
								<span className="text-xl font-bold tracking-tight">
									InkWell
								</span>
							</div>
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
							<div className="hidden lg:block w-[420px] max-w-[40vw]">
								<Suspense fallback={null}>
									<GlobalSearch placeholder="Tìm kiếm posts, series, users…" />
								</Suspense>
							</div>

							{/* Search Icon - Mobile */}
							<Button
								variant="ghost"
								size="icon"
								className="hidden sm:flex lg:hidden"
								aria-label="Search"
								onClick={() => setIsMobileSearchOpen((v) => !v)}
							>
								<Search className="w-5 h-5" />
							</Button>

							{user ? (
								<Suspense fallback={null}>
									<NotificationCenter />
								</Suspense>
							) : null}

							<AnimatedThemeToggler />

							{user ? (
								<>
									<Link to="/dashboard/article" className="hidden sm:block">
										<Button
											className="gap-2 border border-dashed border-primary"
											variant="ghost"
										>
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
												setIsUserDropdownOpen(!isUserDropdownOpen);
												setIsNotificationDropdownOpen(false);
											}}
										>
											{user.avatar ? (
												<Avatar className="h-8 w-8">
													<AvatarImage
														src={resolveAvatarUrl(user.avatar)}
														alt={user.username}
													/>
													<AvatarFallback>
														{user.username?.[0]?.toUpperCase() || "U"}
													</AvatarFallback>
												</Avatar>
											) : (
												<UserAvatar username={user.username} />
											)}
										</Button>

										{isUserDropdownOpen && (
											<div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
												<div className="p-4 border-b border-border">
													<p className="font-semibold text-foreground">
														{user?.username}
													</p>
													<p className="text-sm text-muted-foreground">
														{user?.email}
													</p>
												</div>
												<div className="py-2">
													{userMenuItems.map((item) => {
														const Icon = item.icon;
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
														);
													})}
													<button
														type="button"
														onClick={handleLogout}
														className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors w-full text-left"
													>
														<LogOut className="w-4 h-4" />
														Đăng xuất
													</button>
												</div>
											</div>
										)}
									</div>
								</>
							) : (
								<>
									<Link to="/login" className="hidden md:block">
										<Button variant="ghost">Đăng nhập</Button>
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
								{isOpen ? (
									<X className="w-5 h-5" />
								) : (
									<Menu className="w-5 h-5" />
								)}
							</Button>
						</div>
					</div>

					{/* Mobile Search Bar (sm -> lg) */}
					{isMobileSearchOpen ? (
						<div className="hidden sm:block lg:hidden pb-3">
							<Suspense fallback={null}>
								<GlobalSearch placeholder="Tìm kiếm…" />
							</Suspense>
						</div>
					) : null}

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
								<Suspense fallback={null}>
									<GlobalSearch placeholder="Tìm kiếm…" />
								</Suspense>
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
			<ScrollProgress className={isScrolled ? "top-[57px]" : "top-[65px]"} />
		</>
	);
}
