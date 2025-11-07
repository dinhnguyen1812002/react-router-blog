
import { useEffect } from "react";

import { Button } from "~/components/ui/button";
import { Home, ArrowLeft, House } from "lucide-react";
import { Link, useLocation } from "react-router";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { Route } from "../../+types/root";

export function meta({ }: Route.MetaArgs) {
    return [
        // Basic SEO Metadata
        { title: "Blog App - Trang không tồn tại" },
        {
            name: "description",
            content:
                "Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.",
        },
        {
            name: "keywords",
            content:
                "blog, articles, tutorials, writing community, trending topics, categories, insights, knowledge sharing",
        },

        // Open Graph (OG) Metadata for Social Media (e.g., Facebook, LinkedIn)
        { property: "og:title", content: "Blog App - Trang không tồn tại" },
        {
            property: "og:description",
            content:
                "Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://your-blog-app.com" }, // Replace with your actual domain
        { property: "og:site_name", content: "Blog App" },

        // Twitter Card Metadata
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Blog App - Trang không tồn tại" },
        {
            name: "twitter:description",
            content:
                "Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.",
        },
        // Additional Metadata
        { name: "robots", content: "index, follow" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { charset: "UTF-8" },
    ];
}

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }, [location.pathname]);

    return (
        <div className="flex items-center justify-center ">
            <div>
                <DotLottieReact
                    src="/lottiefiles/404.json"
                    loop
                    autoplay
                    style={{ width: '100%', height: '100%' }}
                />
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4 animate-fade-in delay-100">
                    Oops! Trang không tồn tại
                </h2>

                <p className="text-lg text-muted-foreground mb-8 animate-fade-in delay-200 max-w-md mx-auto">
                    Có vẻ như bạn đã đi lạc đường. Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                </p>


                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in delay-300">

                    <Link to="/" className="flex">
                        <House className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </Link>


                    <Button asChild variant="outline" size="lg" className="gap-2 group">
                        <button onClick={() => window.history.back()}>
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Quay lại
                        </button>
                    </Button>
                    <div className="animate-fade-in delay-500 text-center">
                        <p className="text-sm text-muted-foreground">
                            Đường dẫn: <code className="px-2 py-1 bg-muted rounded text-xs">{location.pathname}</code>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default NotFound;
