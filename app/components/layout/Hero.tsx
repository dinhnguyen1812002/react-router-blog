import { ArrowRight, Play } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router';


export default function HeroSection() {
  return (
    <section className="py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Text Content - 60% */}
          <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight dark:text-white">
                Discover Amazing
                <span className="text-primary block">Stories & Ideas</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Join our community of writers and readers sharing insights, experiences, and knowledge across technology, design, business, and lifestyle.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link  to={"/posts"}>
                
                <Button 
                size="lg" 
                className="group bg-primary hover:bg-primary/90 transition-all duration-300"
              >
                Start Reading
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
                </Link>
              
              {/* <Button 
                variant="outline" 
                size="lg"  
                className="group hover:bg-blue-500 transition-all duration-300 dark:text-white "
              >
                <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />

              </Button> */}

              
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-border">
              <div className="text-center sm:text-left"> 
                <div className="text-2xl lg:text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Active Readers</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-primary">1.2K+</div>
                <div className="text-sm text-muted-foreground">Published Articles</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl lg:text-3xl font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground">Expert Writers</div>
              </div>
            </div>
          </div>

          {/* Image - 40% */}
          <div className="lg:col-span-2 relative animate-in fade-in slide-in-from-right duration-1000 delay-300">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg"
                alt="People collaborating and writing"
                className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-secondary/20 rounded-full blur-xl animate-pulse delay-1000"></div>
              
              {/* Overlay Badge */}
              <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Live Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}