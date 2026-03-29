import {
	ArrowRight,
	BookOpen,
	CheckCircle2,
	Heart,
	Shield,
	Sparkles,
	Star,
	TrendingUp,
	Users,
	X,
} from "lucide-react";
import {
	FEATURES,
	STATS,
	TEAM,
	TESTIMONIALS,
	VALUES,
} from "~/components/constants";
import { MainLayout } from "~/components/layout/MainLayout";
import Section from "~/components/layout/Section";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
	return [
		// Basic SEO Metadata
		{
			title:
				"Về chúng tôi - Inkwell | Nền tảng viết lách dành cho những tâm hồn sáng tạo",
		},
		{
			name: "description",
			content:
				"Khám phá câu chuyện đằng sau Inkwell - nền tảng blog cao cấp được thiết kế cho những nhà văn nghiêm túc. Tham gia cộng đồng 500k+ tác giả đam mê chia sẻ kiến thức và sáng tạo nội dung chất lượng.",
		},
		{
			name: "keywords",
			content:
				"về inkwell, nền tảng blog, viết lách, cộng đồng tác giả, xuất bản, chia sẻ kiến thức, blog cao cấp, trình soạn thảo, AI hỗ trợ viết, phân tích nội dung, tác giả việt nam",
		},

		// Open Graph (OG) Metadata for Social Media
		{
			property: "og:title",
			content: "Về chúng tôi - Inkwell | Crafting spaces for deep thought",
		},
		{
			property: "og:description",
			content:
				"Inkwell không chỉ là một nền tảng blog. Đây là hệ sinh thái cao cấp được thiết kế cho những nhà văn nghiêm túc, những người coi trọng sự tập trung, thẩm mỹ và quyền sở hữu thực sự nội dung của họ.",
		},
		{ property: "og:type", content: "website" },
		{ property: "og:url", content: "https://inkwell.vn/about" },
		{
			property: "og:image",
			content: "https://inkwell.vn/images/about-og-image.jpg",
		},
		{ property: "og:site_name", content: "Inkwell" },
		{ property: "og:locale", content: "vi_VN" },

		// Twitter Card Metadata
		{ name: "twitter:card", content: "summary_large_image" },
		{
			name: "twitter:title",
			content: "Về Inkwell - Nền tảng viết lách cho những tâm hồn sáng tạo",
		},
		{
			name: "twitter:description",
			content:
				"Tìm hiểu về sứ mệnh và tầm nhìn của Inkwell - nơi dân chủ hóa việc xuất bản chất lượng cao và thúc đẩy kết nối con người thông qua những câu chuyện dài.",
		},
		{
			name: "twitter:image",
			content: "https://inkwell.vn/images/about-twitter-card.jpg",
		},
		{ name: "twitter:site", content: "@InkwellVN" },
		{ name: "twitter:creator", content: "@InkwellVN" },

		// Additional SEO Metadata
		{ name: "robots", content: "index, follow, max-image-preview:large" },
		{ name: "googlebot", content: "index, follow" },
		{ name: "author", content: "Inkwell Team" },
		{ name: "publisher", content: "Inkwell" },

		// Language and Region
		{ name: "language", content: "Vietnamese" },
		{ name: "geo.region", content: "VN" },
		{ name: "geo.country", content: "Vietnam" },

		// Schema.org structured data for better search understanding
		{ name: "application-name", content: "Inkwell" },
		{ name: "theme-color", content: "#4f46e5" },
		{ name: "msapplication-TileColor", content: "#4f46e5" },

		// Canonical URL
		{ rel: "canonical", href: "https://inkwell.vn/about" },

		// Additional meta tags for better SEO
		{ name: "format-detection", content: "telephone=no" },
		{ name: "mobile-web-app-capable", content: "yes" },
		{ name: "apple-mobile-web-app-capable", content: "yes" },
		{ name: "apple-mobile-web-app-status-bar-style", content: "default" },
	];
}
const About = () => {
	return (
		<MainLayout>
			{/* NEW REDESIGNED HERO SECTION */}
			<section className="relative pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-white dark:bg-slate-950">
				{/* Background Decorative Elements */}
				<div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 dark:bg-slate-900/30 z-0 hidden lg:block"></div>
				<div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100 dark:bg-indigo-500/20 rounded-full blur-3xl opacity-40"></div>

				<div className="container mx-auto px-6 relative z-10">
					<div className="flex flex-col lg:flex-row items-center gap-16">
						{/* Left Content Column */}
						<div className="w-full lg:w-3/5 text-left">
							<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-sm font-bold tracking-wide uppercase mb-6">
								<Star size={14} fill="currentColor" />
								The Web's Most Loved Editor
							</div>

							<h1 className="text-6xl md:text-8xl font-bold font-serif-title text-slate-900 dark:text-slate-50 leading-[0.95] mb-8 tracking-tight">
								Crafting <span className="text-indigo-600 italic">spaces</span>{" "}
								<br />
								for deep{" "}
								<span className="relative">
									thought.
									<svg
										className="absolute -bottom-2 left-0 w-full h-3 text-indigo-200 dark:text-indigo-500/30 -z-10"
										viewBox="0 0 100 10"
										preserveAspectRatio="none"
									>
										<path
											d="M0 5 Q 25 0 50 5 T 100 5"
											stroke="currentColor"
											strokeWidth="8"
											fill="none"
										/>
									</svg>
								</span>
							</h1>

							<p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-10">
								Inkwell isn't just a blogging platform. It's a premium ecosystem
								designed for serious writers who value focus, aesthetics, and
								true ownership of their content.
							</p>

							<div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12">
								<button className="group relative bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-300 flex items-center gap-2 shadow-2xl shadow-indigo-200 dark:shadow-indigo-950/40">
									Start Your Journey
									<ArrowRight
										size={20}
										className="group-hover:translate-x-1 transition-transform"
									/>
								</button>
								<div className="flex flex-col">
									<div className="flex -space-x-2 mb-1">
										{[1, 2, 3, 4].map((i) => (
											<img
												key={i}
												src={`https://i.pravatar.cc/100?img=${i + 10}`}
												className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950"
												alt="user"
											/>
										))}
										<div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950 bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-300">
											+12k
										</div>
									</div>
									<span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
										Joined by 500k+ writers
									</span>
								</div>
							</div>

							<div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
								<div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
									<CheckCircle2 size={18} className="text-emerald-500" /> No
									ads. Ever.
								</div>
								<div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
									<CheckCircle2 size={18} className="text-emerald-500" /> Custom
									Domains
								</div>
								<div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
									<CheckCircle2 size={18} className="text-emerald-500" /> Full
									Analytics
								</div>
							</div>
						</div>

						{/* Right Visual Column */}
						<div className="w-full lg:w-2/5 relative">
							<div className="relative">
								{/* Main Image */}
								<div className="rounded-[3rem] overflow-hidden shadow-2xl rotate-2 transition-transform hover:rotate-0 duration-700">
									<img
										src="https://i.pinimg.com/736x/8f/f4/60/8ff460e39376f968f72ec929ae410c7b.jpg"
										alt="Creative workspace"
										className="w-full h-[500px] object-cover"
									/>
								</div>

								{/* Floating UI Elements */}
								<div
									className="absolute -left-12 top-1/4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 animate-bounce transition-all hover:scale-105 duration-300 hidden sm:block"
									style={{ animationDuration: "4s" }}
								>
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-300">
											<X size={20} />
										</div>
										<div>
											<div className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase">
												Status
											</div>
											<div className="text-sm font-bold text-slate-900 dark:text-slate-50">
												Auto-sharing enabled
											</div>
										</div>
									</div>
								</div>

								<div className="absolute -right-8 bottom-12 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-[200px] hidden sm:block">
									<div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
										<div className="w-2/3 h-full bg-emerald-400 rounded-full"></div>
									</div>
									<div className="text-xs font-bold text-slate-900 dark:text-slate-50 mb-1">
										Weekly Growth
									</div>
									<div className="text-2xl font-bold text-slate-900 dark:text-slate-50 font-serif-title">
										+24.8%
									</div>
								</div>

								{/* Decorative Dots */}
								<div className="absolute -bottom-6 -left-6 grid grid-cols-4 gap-2 opacity-20">
									{[...Array(16)].map((_, i) => (
										<div
											key={i}
											className="w-2 h-2 bg-indigo-600 rounded-full"
										></div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* MISSION & VISION */}
			<Section title="Built for the love of writing." subtitle="Our Story">
				<div className="grid md:grid-cols-2 gap-16 items-center">
					<div className="relative group">
						<div className="absolute inset-0 bg-indigo-600 rounded-2xl rotate-3 scale-105 opacity-10 group-hover:rotate-1 transition-transform duration-500"></div>
						<img
							src="https://i.pinimg.com/736x/64/6a/4a/646a4afe201703f2c02fb24d4adcae88.jpg"
							alt="Cozy writing space"
							className="rounded-2xl shadow-2xl relative z-10 w-full object-cover aspect-[4/3]"
						/>
					</div>
					<div className="space-y-8">
						<div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
							<h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-slate-900 dark:text-slate-50">
								<span className="w-1.5 h-8 bg-indigo-500 rounded-full"></span>
								The Mission
							</h3>
							<p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
								We believe that great ideas shouldn't be buried in noisy feeds
								or lost in clunky interfaces. Our mission is to democratize
								high-quality publishing and foster human connection through
								long-form stories.
							</p>
						</div>
						<div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
							<h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-rose-600 dark:text-rose-400">
								<span className="w-1.5 h-8 bg-rose-500 rounded-full"></span>
								The Vision
							</h3>
							<p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
								To become the world's most trusted home for thoughtful
								discourse. We're building a future where the internet returns to
								its roots: a place for discovery, depth, and genuine community.
							</p>
						</div>
					</div>
				</div>
			</Section>

			{/* CORE VALUES */}
			<Section
				title="What we stand for."
				subtitle="Core Values"
				centered
				className="bg-slate-50 dark:bg-slate-950"
			>
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
					{VALUES.map((value) => (
						<div
							key={value.id}
							className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all transform hover:-translate-y-2 group shadow-sm hover:shadow-xl"
						>
							<div className="mb-6 bg-slate-50 dark:bg-slate-950 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
								{value.icon}
							</div>
							<h4 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-50">
								{value.title}
							</h4>
							<p className="text-slate-600 dark:text-slate-300 leading-relaxed">
								{value.description}
							</p>
						</div>
					))}
				</div>
			</Section>

			{/* STATISTICS */}
			<section className="py-24 bg-slate-900 text-white relative overflow-hidden">
				<div className="absolute top-0 right-0 w-full h-full opacity-10">
					<div className="absolute top-0 left-10 w-40 h-40 bg-indigo-500 rounded-full blur-[100px]"></div>
					<div className="absolute bottom-10 right-10 w-40 h-40 bg-rose-500 rounded-full blur-[100px]"></div>
				</div>
				<div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center relative z-10">
					{STATS.map((stat) => (
						<div key={stat.id}>
							<div className="text-4xl md:text-6xl font-bold font-serif-title mb-2">
								{stat.value}
								{stat.suffix}
							</div>
							<div className="text-slate-400 font-medium uppercase tracking-widest text-sm">
								{stat.label}
							</div>
						</div>
					))}
				</div>
			</section>

			{/* KEY FEATURES */}
			<Section
				title="Everything you need, nothing you don't."
				subtitle="Platform Features"
			>
				<div className="grid md:grid-cols-2 gap-x-20 gap-y-12">
					{FEATURES.map((feature) => (
						<div key={feature.id} className="flex gap-6 group">
							<div className="flex-shrink-0 w-14 h-14 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
								{feature.icon}
							</div>
							<div>
								<h4 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-50">
									{feature.title}
								</h4>
								<p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
									{feature.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</Section>

			{/* TEAM SECTION */}
			<Section
				title="The humans behind the screen."
				subtitle="Our Team"
				centered
				className="bg-slate-50 dark:bg-slate-950"
			>
				<div className="grid md:grid-cols-3 gap-12">
					{TEAM.map((member) => (
						<div key={member.id} className="group text-center">
							<div className="relative mb-6 mx-auto w-48 h-48 lg:w-64 lg:h-64 overflow-hidden rounded-[2.5rem] rotate-3 group-hover:rotate-0 transition-all duration-500 shadow-xl">
								<img
									src={member.image}
									alt={member.name}
									className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
								/>
								<div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
							</div>
							<h4 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">
								{member.name}
							</h4>
							<p className="text-indigo-600 font-medium mb-3">{member.role}</p>
							<p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto italic">
								"{member.bio}"
							</p>
						</div>
					))}
				</div>
			</Section>

			{/* TESTIMONIALS */}
			<Section
				title="Loved by curious minds."
				subtitle="Community Voice"
				centered
			>
				<div className="grid md:grid-cols-3 gap-8">
					{TESTIMONIALS.map((t) => (
						<div
							key={t.id}
							className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between"
						>
							<div>
								<p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed mb-8 font-medium">
									"{t.content}"
								</p>
							</div>
							<div className="flex items-center gap-4">
								<img
									src={t.avatar}
									alt={t.author}
									className="w-12 h-12 rounded-full ring-2 ring-indigo-50 dark:ring-indigo-500/20"
								/>
								<div className="text-left">
									<div className="font-bold text-slate-900 dark:text-slate-50">
										{t.author}
									</div>
									<div className="text-indigo-600 text-sm">{t.handle}</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</Section>

			{/* CALL TO ACTION */}
			<section className="py-20 px-6 dark:bg-slate-950">
				<div className="container mx-auto">
					<div className="bg-indigo-600 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl">
						<div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
							<div className="absolute -top-20 -left-20 w-80 h-80 border-4 border-white rounded-full"></div>
							<div className="absolute -bottom-20 -right-20 w-80 h-80 border-4 border-white rounded-full"></div>
						</div>

						<h2 className="text-4xl md:text-6xl font-bold font-serif-title mb-8 relative z-10 leading-tight">
							Ready to start your next chapter?
						</h2>
						<p className="text-xl md:text-2xl text-indigo-100 mb-12 max-w-2xl mx-auto relative z-10">
							Join 500k+ writers and start sharing your stories with the world
							today. No credit card required.
						</p>
						<div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
							<button className="bg-white dark:bg-slate-100 text-indigo-600 px-12 py-5 rounded-full text-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-200 transition-all transform hover:scale-105 active:scale-95 shadow-xl">
								Sign Up for Free
							</button>
							<button className="bg-indigo-700/50 backdrop-blur-sm text-white border border-indigo-400/30 px-12 py-5 rounded-full text-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
								See Live Demo <ArrowRight size={20} />
							</button>
						</div>
					</div>
				</div>
			</section>
		</MainLayout>
	);
};

export default About;
