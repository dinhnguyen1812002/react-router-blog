
import { Button } from "~/components/ui/button"
import { Edit3, Trash2, Eye, Heart, MessageCircle, Calendar } from "lucide-react"
import { Link } from "react-router"

interface Post {
  id: string
  title: string
  slug: string
  thumbnail?: string
  excerpt?: string
  createdAt: string
  viewCount: number
  likeCount: number
  commentCount: number
  is_publish: boolean
}

interface PostListProps {
  posts: Post[]
  onDelete?: (id: string, title: string) => void
  formatDateSimple?: (date: string) => string
}

const formatDateSimple = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function ListView({ posts, onDelete, formatDateSimple: formatDate = formatDateSimple }: PostListProps) {
  return (
    <div className="space-y-2 ">
      {posts.map((post) => (
        <Link key={post.id} to={`/articles/${post.slug}`}>
          <div className="group overflow-hidden hover:bg-muted/50 transition-all duration-300 cursor-pointer rounded-lg">
            <div className="flex flex-col md:flex-row gap-3 p-3 border-b-2 border-gray-200 dark:border-gray-700">
              <div className="flex-shrink-0 w-full md:w-40 h-32 md:h-24 rounded-lg overflow-hidden bg-muted">
                {post.thumbnail ? (
                  <img
                    src={post.thumbnail || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                    <svg
                      className="w-10 h-10 text-muted-foreground/50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <span
                      className={`flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${
                        post.is_publish
                          ? "bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/30"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {post.is_publish ? "Published" : "Draft"}
                    </span>
                  </div>
                  {post.excerpt && <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{post.excerpt}</p>}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{post.viewCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-red-500/70" />
                    <span>{post.likeCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{post.commentCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className=" flex md:flex-col items-center gap-2 justify-end">
                <Link to={`/dashboard/posts/edit/${post.id}`} onClick={(e) => e.stopPropagation()}>
                  <Button variant="outline" size="sm" className="hover:bg-primary/10 bg-transparent">
                    <Edit3 className="w-4 h-4" />
                    <span className="sr-only">Edit post</span>
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-destructive/10 bg-transparent"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onDelete?.(post.id, post.title)
                  }}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                  <span className="sr-only">Delete post</span>
                </Button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
