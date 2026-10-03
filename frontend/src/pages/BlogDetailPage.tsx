import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { Json } from "@/integrations/supabase/types";
import { Header } from "@/components/shared/Header";

interface AuthorData {
  name: string;
  avatar: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  cover_image: string;
  created_at: string;
  category: string;
  author: AuthorData;
  read_time: number;
}

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          // Parse the author data from JSON
          let authorData: AuthorData;

          // Handle different formats the author might be in
          if (typeof data.author === "string") {
            try {
              authorData = JSON.parse(data.author);
            } catch (e) {
              // If parsing fails, use default values
              authorData = { name: "Unknown Author", avatar: "" };
            }
          } else if (data.author && typeof data.author === "object") {
            // If it's already an object (from Supabase JSON column)
            const jsonAuthor = data.author as Json;
            if (
              jsonAuthor &&
              typeof jsonAuthor === "object" &&
              "name" in jsonAuthor &&
              "avatar" in jsonAuthor
            ) {
              authorData = {
                name: (jsonAuthor.name as string) || "Unknown Author",
                avatar: (jsonAuthor.avatar as string) || "",
              };
            } else {
              authorData = { name: "Unknown Author", avatar: "" };
            }
          } else {
            authorData = { name: "Unknown Author", avatar: "" };
          }

          // Format the blog post with the parsed author
          const formattedPost: BlogPost = {
            ...data,
            author: authorData,
          };

          setPost(formattedPost);
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container py-8">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="aspect-video bg-muted rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/">
              <div className="font-semibold">
                <span className="text-primary">Wellness</span> AI Lens
              </div>
            </Link>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 container py-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The blog post you're looking for doesn't exist or has been
              removed.
            </p>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" size="sm" className="mb-6" asChild>
            <Link to="/blog" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <Avatar>
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>
                  {post.author.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.author.name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(post.created_at), "MMM d, yyyy")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.read_time} min read
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full rounded-lg object-cover"
                style={{ maxHeight: "500px" }}
              />
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            <div className="border-t border-b py-8 my-8">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>
                    {post.author.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium mb-1">
                    Written by {post.author.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    A health and wellness expert passionate about helping people
                    live healthier, more balanced lives through evidence-based
                    nutrition and lifestyle practices.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-lg font-semibold">
              <span className="text-primary">Wellness</span> AI Lens
            </span>
            <p className="text-sm text-muted-foreground mt-1">
              © 2025 All rights reserved
            </p>
          </div>
          <div className="flex gap-6">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
