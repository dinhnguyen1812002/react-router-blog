import { ArrowRight, CheckCircle2, Play, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router';
import { TypingAnimation } from '../ui/typing-animation';
import { IconBrandTwitter } from '@tabler/icons-react';


// export default function HeroSection() {
//   return (
//     <section className="py-20 lg:py-32 overflow-hidden">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
//           {/* Text Content - 60% */}
//           <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-left duration-1000">
//             <div className="space-y-4">
//               <h1 className="text-4xl lg:text-6xl font-bold leading-tight dark:text-white">
//                 Discover Amazing
//                 <span className="text-primary block">Stories & Ideas</span>
//               </h1>
//               <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
//                 Join our community of writers and readers sharing insights, experiences, and knowledge across technology, design, business, and lifestyle.
//               </p>

              
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4">
//                 <Link  to={"/articles"}>
                
//                 <Button 
//                 size="lg" 
//                 className="group bg-primary hover:bg-primary/90 transition-all duration-300"
//               >
//                 Start Reading
//                 <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
//               </Button>
//                 </Link>
              
//               {/* <Button 
//                 variant="outline" 
//                 size="lg"  
//                 className="group hover:bg-blue-500 transition-all duration-300 dark:text-white "
//               >
//                 <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />

//               </Button> */}

              
//             </div>

//             {/* Stats */}
//             <div className="flex flex-wrap gap-8 pt-8 border-t border-border">
//               <div className="text-center sm:text-left"> 
//                 <div className="text-2xl lg:text-3xl font-bold text-primary">50K+</div>
//                 <div className="text-sm text-muted-foreground">Active Readers</div>
//               </div>
//               <div className="text-center sm:text-left">
//                 <div className="text-2xl lg:text-3xl font-bold text-primary">1.2K+</div>
//                 <div className="text-sm text-muted-foreground">Published Articles</div>
//               </div>
//               <div className="text-center sm:text-left">
//                 <div className="text-2xl lg:text-3xl font-bold text-primary">200+</div>
//                 <div className="text-sm text-muted-foreground">Expert Writers</div>
//               </div>
//             </div>
//           </div>

//           {/* Image - 40% */}
//           <div className="lg:col-span-2 relative animate-in fade-in slide-in-from-right duration-1000 delay-300">
//             <div className="relative">
//               <img
//                 src="https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg"
//                 alt="People collaborating and writing"
//                 className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-700"
//               />
              
//               {/* Floating Elements */}
//               <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
//               <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000"></div>
              
//               {/* Overlay Badge */}
//               <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
//                 <div className="flex items-center space-x-2 text-sm">
//                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                   <span className="font-medium">Live Updates</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


export default function HeroSection() {
  return (
      <section className="relative pt-32 pb-20  md:pb-32 overflow-hidden bg-white dark:bg-slate-950">
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
                          <IconBrandTwitter size={20} />
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
  );
}