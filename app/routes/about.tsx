import { Button } from "~/components/ui/button";

import { BookOpen, Users, Sparkles, TrendingUp, Heart, Shield } from "lucide-react";
import { Card, CardContent } from "~/components/ui/Card";
import { Link } from "react-router";
import { MainLayout } from "~/components/layout/MainLayout";
import type { Route } from "../+types/root";


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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            Nền tảng blog cho
            <span className="text-primary"> những người yêu viết lách</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            BlogPlatform là nơi các tác giả, nhà sáng tạo nội dung và người đam mê chia sẻ 
            câu chuyện, kiến thức và ý tưởng của mình với thế giới.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-secondary/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Sứ mệnh của chúng tôi
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trao quyền cho mọi người kể câu chuyện của họ và kết nối với cộng đồng toàn cầu 
              thông qua sức mạnh của văn bản.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {values.map((value, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardContent className="p-8">
                  <value.icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Tại sao chọn BlogPlatform?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Chúng tôi cung cấp mọi công cụ bạn cần để viết, xuất bản và phát triển 
              độc giả của mình.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <feature.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">100K+</div>
              <div className="text-lg opacity-90">Tác giả</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">5M+</div>
              <div className="text-lg opacity-90">Bài viết</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50M+</div>
              <div className="text-lg opacity-90">Độc giả hàng tháng</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Sẵn sàng bắt đầu hành trình viết lách?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Tham gia cùng hàng nghìn tác giả đang chia sẻ câu chuyện của họ trên BlogPlatform.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="text-base px-8">
              Tạo tài khoản miễn phí
            </Button>
            <Link to="/">
              <Button size="lg" variant="outline" className="text-base px-8">
                Tìm hiểu thêm
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </MainLayout>

  );
};

export default About;
