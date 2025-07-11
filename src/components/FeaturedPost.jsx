// File: src/pages/Home.jsx

import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import BlogCard from "@/components/BlogCard";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const { data, error } = await supabase
          .from("blog")
          .select("*")
          .not("publishedat", "is", null)
          .order("publishedat", { ascending: false });

        if (error) throw error;

        setBlogs(data);
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
  if (blogs.length === 0) return <p>No published blogs found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {blogs.map(blog => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
