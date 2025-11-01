import { Search, TrendingUp } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";

const categories = [
  { name: "Web Development", count: 24 },
  { name: "JavaScript", count: 18 },
  { name: "UI/UX Design", count: 15 },
  { name: "React", count: 12 },
  { name: "CSS", count: 10 },
  { name: "TypeScript", count: 8 },
];

const recentPosts = [
  { title: "Getting Started with React Hooks", date: "Mar 15, 2024" },
  { title: "Modern CSS Techniques", date: "Mar 12, 2024" },
  { title: "TypeScript Best Practices", date: "Mar 10, 2024" },
  { title: "Building Responsive Layouts", date: "Mar 8, 2024" },
];

export const AdvancedFiltersSidebar = () => {
  return (
    <aside className="space-y-6 animate-fade-in">
      {/* Search */}
      <div className="p-6">
        {/* <h3 className="text-lg font-semibold mb-4">Search</h3> */}
         <Input
            type="search"
            placeholder="Search posts..."
            className="pl-9"
          />
      </div>

      {/* Categories */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Categories
        </h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <button
              key={category.name}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors text-left group"
            >
              <span className="text-sm font-medium group-hover:text-primary transition-colors">
                {category.name}
              </span>
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </button>
          ))}
        </div>
      </Card>

      {/* Recent Posts */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
        <div className="space-y-4">
          {recentPosts.map((post, index) => (
            <a
              key={index}
              href="#"
              className="block group"
            >
              <h4 className="text-sm font-medium leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h4>
              <p className="text-xs text-muted-foreground">{post.date}</p>
            </a>
          ))}
        </div>
      </Card>

      {/* Newsletter */}
      <Card className="p-6 bg-primary/5 border-primary/20">
        <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Get the latest articles delivered to your inbox.
        </p>
        <Input
          type="email"
          placeholder="Your email"
          className="mb-3"
        />
        <Button className="w-full bg-primary hover:bg-primary/90 transition-colors">
          Subscribe
        </Button>
      </Card>
    </aside>
  );
};
