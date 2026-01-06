import { Button } from "~/components/ui/button";

import { BookOpen, Users, Sparkles, TrendingUp, Heart, Shield, ArrowRight, Star, CheckCircle2, Twitter } from "lucide-react";
import { Card, CardContent } from "~/components/ui/Card";
import { Link } from "react-router";
import { MainLayout } from "~/components/layout/MainLayout";
import type { Route } from "../+types/root";
import Section from "~/components/layout/Section";

import { 
  VALUES, 
  FEATURES, 
  TEAM, 
  STATS, 
  TESTIMONIALS 
} from '~/components/constants';

export function meta({ }: Route.MetaArgs) {
  return [
    // Basic SEO Metadata
    { title: "Blog App - Discover Inspiring Stories & Insights" },
    {
      name: "description",
      content:
        "Explore a vibrant community of writers sharing knowledge, tutorials, and insights. Discover trending articles, popular categories, and connect with creators on our blog platform.",
    },
    {
      name: "keywords",
      content:
        "blog, articles, tutorials, writing community, trending topics, categories, insights, knowledge sharing",
    },

    // Open Graph (OG) Metadata for Social Media (e.g., Facebook, LinkedIn)
    { property: "og:title", content: "Blog App - Your Source for Inspiring Content" },
    {
      property: "og:description",
      content:
        "Join our blog platform to read, write, and connect with a global community of writers and readers. Explore trending articles and diverse topics.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://your-blog-app.com" }, // Replace with your actual domain
    { property: "og:image", content: "https://your-blog-app.com/og-image.jpg" }, // Replace with a relevant image URL
    { property: "og:site_name", content: "Blog App" },

    // Twitter Card Metadata
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Blog App - Discover Inspiring Stories" },
    {
      name: "twitter:description",
      content:
        "Read and share inspiring articles on our blog platform. Join a community of writers and explore trending topics today!",
    },
    { name: "twitter:image", content: "https://your-blog-app.com/twitter-image.jpg" }, // Replace with a relevant image URL
    { name: "twitter:site", content: "@YourBlogHandle" }, // Replace with your Twitter handle

    // Additional Metadata
    { name: "robots", content: "index, follow" },
    { name: "viewport", content: "width=device-width, initial-scale=1.0" },
    { charset: "UTF-8" },
  ];
}
const About = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Viết & Xuất bản dễ dàng",
      description: "Trình soạn thảo thông minh giúp bạn tập trung vào nội dung, chúng tôi lo phần còn lại."
    },
    {
      icon: Users,
      title: "Cộng đồng sôi động",
      description: "Kết nối với hàng nghìn tác giả và độc giả đam mê chia sẻ kiến thức."
    },
    {
      icon: Sparkles,
      title: "Tính năng AI thông minh",
      description: "Công cụ AI hỗ trợ viết lách, tối ưu nội dung và gợi ý chủ đề hấp dẫn."
    },
    {
      icon: TrendingUp,
      title: "Phân tích chi tiết",
      description: "Theo dõi lượt xem, tương tác và phát triển độc giả của bạn."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Đam mê sáng tạo",
      description: "Chúng tôi tin rằng mỗi người đều có câu chuyện đáng kể. Sứ mệnh của chúng tôi là tạo không gian để những câu chuyện đó được lắng nghe."
    },
    {
      icon: Shield,
      title: "Minh bạch & An toàn",
      description: "Bảo vệ quyền tác giả và dữ liệu của bạn là ưu tiên hàng đầu. Nền tảng của chúng tôi được xây dựng với các tiêu chuẩn bảo mật cao nhất."
    }
  ];

  return (
    <MainLayout >
     {/* NEW REDESIGNED HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white dark:bg-slate-950">
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
                Crafting <span className="text-indigo-600 italic">spaces</span> <br />
                for deep <span className="relative">
                  thought.
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-200 dark:text-indigo-500/30 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-10">
                Inkwell isn't just a blogging platform. It's a premium ecosystem designed for serious writers who value focus, aesthetics, and true ownership of their content.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12">
                <button className="group relative bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-300 flex items-center gap-2 shadow-2xl shadow-indigo-200 dark:shadow-indigo-950/40">
                  Start Your Journey
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex flex-col">
                  <div className="flex -space-x-2 mb-1">
                    {[1, 2, 3, 4].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950" alt="user" />
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950 bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-300">+12k</div>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Joined by 500k+ writers</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                  <CheckCircle2 size={18} className="text-emerald-500" /> No ads. Ever.
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                  <CheckCircle2 size={18} className="text-emerald-500" /> Custom Domains
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                  <CheckCircle2 size={18} className="text-emerald-500" /> Full Analytics
                </div>
              </div>
            </div>

            {/* Right Visual Column */}
            <div className="w-full lg:w-2/5 relative">
              <div className="relative">
                {/* Main Image */}
                <div className="rounded-[3rem] overflow-hidden shadow-2xl rotate-2 transition-transform hover:rotate-0 duration-700">
                  <img 
                    src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop" 
                    alt="Creative workspace" 
                    className="w-full h-[500px] object-cover"
                  />
                </div>
                
                {/* Floating UI Elements */}
                <div className="absolute -left-12 top-1/4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 animate-bounce transition-all hover:scale-105 duration-300 hidden sm:block" style={{ animationDuration: '4s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-300">
                      <Twitter size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase">Status</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-50">Auto-sharing enabled</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-8 bottom-12 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-[200px] hidden sm:block">
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                    <div className="w-2/3 h-full bg-emerald-400 rounded-full"></div>
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-50 mb-1">Weekly Growth</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-50 font-serif-title">+24.8%</div>
                </div>

                {/* Decorative Dots */}
                <div className="absolute -bottom-6 -left-6 grid grid-cols-4 gap-2 opacity-20">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-indigo-600 rounded-full"></div>
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
              src="https://picsum.photos/seed/writing/800/600" 
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
                We believe that great ideas shouldn't be buried in noisy feeds or lost in clunky interfaces. Our mission is to democratize high-quality publishing and foster human connection through long-form stories.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-rose-600 dark:text-rose-400">
                <span className="w-1.5 h-8 bg-rose-500 rounded-full"></span>
                The Vision
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                To become the world's most trusted home for thoughtful discourse. We're building a future where the internet returns to its roots: a place for discovery, depth, and genuine community.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* CORE VALUES */}
      <Section title="What we stand for." subtitle="Core Values" centered className="bg-slate-50 dark:bg-slate-950">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUES.map((value) => (
            <div key={value.id} className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all transform hover:-translate-y-2 group shadow-sm hover:shadow-xl">
              <div className="mb-6 bg-slate-50 dark:bg-slate-950 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-colors">
                {value.icon}
              </div>
              <h4 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-50">{value.title}</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{value.description}</p>
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
                {stat.value}{stat.suffix}
              </div>
              <div className="text-slate-400 font-medium uppercase tracking-widest text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* KEY FEATURES */}
      <Section title="Everything you need, nothing you don't." subtitle="Platform Features">
        <div className="grid md:grid-cols-2 gap-x-20 gap-y-12">
          {FEATURES.map((feature) => (
            <div key={feature.id} className="flex gap-6 group">
              <div className="flex-shrink-0 w-14 h-14 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-50">{feature.title}</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* TEAM SECTION */}
      <Section title="The humans behind the screen." subtitle="Our Team" centered className="bg-slate-50 dark:bg-slate-950">
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
              <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">{member.name}</h4>
              <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto italic">"{member.bio}"</p>
            </div>
          ))}
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section title="Loved by curious minds." subtitle="Community Voice" centered>
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed mb-8 font-medium">
                  "{t.content}"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full ring-2 ring-indigo-50 dark:ring-indigo-500/20" />
                <div className="text-left">
                  <div className="font-bold text-slate-900 dark:text-slate-50">{t.author}</div>
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
              Join 500k+ writers and start sharing your stories with the world today. No credit card required.
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
