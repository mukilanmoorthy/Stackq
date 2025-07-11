import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import BlogCard from "@/components/BlogCard";
import FeaturedPost from "@/components/FeaturedPost";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const { data, error } = await supabase
          .from("blog")
          .select(`
            id,
            title,
            content,
            cover_url,
            publishedat,
            author_name,
            author_photo,
            post_hash
          `)
          .not("publishedat", "is", null)
          .order("publishedat", { ascending: false });

        if (error) throw error;

        const formatted = data.map((b) => ({
          id: b.id,
          image: b.cover_url || null,
          title: b.title,
          excerpt: b.content?.slice(0, 150) || "",
          publishedAt: new Date(b.publishedat).toLocaleDateString(),
          author: {
            name: b.author_name || "Unknown Author",
            avatar: b.author_photo || "https://via.placeholder.com/40",
          },
          comments: 0,
          post_hash: b.post_hash || "",
        }));

        // ✅ Filter out posts with unknown author or missing post_hash
        const filtered = formatted.filter(
          (b) => b.author.name !== "Unknown Author" && b.post_hash !== ""
        );

        setBlogs(filtered);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setErrorMsg(error.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  if (loading) return <p>Loading blogs...</p>;
  if (errorMsg) return <p className="text-red-600">Error: {errorMsg}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <FeaturedPost />
      {blogs.map((blog) => (
        <div
          key={blog.id}
          onClick={() => navigate(`/blog/${blog.id}`)}
          className="cursor-pointer"
        >
          <BlogCard blog={blog} />
        </div>
      ))}
    </div>
  );
}
