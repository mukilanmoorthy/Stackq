// File: src/components/BlogFeed.jsx

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import BlogCard from './BlogCard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Fetch blogs with flat structure
async function fetchBlogs() {
  const { data, error } = await supabase
    .from('blog')
    .select(`
      id,
      title,
      content,
      cover_url,
      publishedat,
      read_time,
      reactions,
      comments,
      views,
      tags,
      author_name,
      author_photo
    `)
    .not('publishedat', 'is', null)
    .order('publishedat', { ascending: false });

  if (error) throw new Error(error.message);

  return data.map((b) => ({
    id: b.id,
    title: b.title,
    excerpt: b.content?.slice(0, 150) || '',
    image: b.cover_url || null,
    tags: b.tags || [],
    reactions: b.reactions || 0,
    comments: b.comments || 0,
    views: b.views || 0,
    publishedAt: new Date(b.publishedat).toLocaleDateString(),
    readTime: b.read_time || '5 min read',
    author: {
      name: b.author_name || 'Unknown',
      avatar: b.author_photo || 'https://via.placeholder.com/40',
    },
  }));
}

function BlogSkeleton() {
  return (
    <Card className="border-0 bg-card">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-16 h-3" />
          </div>
        </div>
        <Skeleton className="w-full h-6 mb-2" />
        <Skeleton className="w-3/4 h-6 mb-4" />
        <Skeleton className="w-full h-3 mb-2" />
        <Skeleton className="w-2/3 h-3 mb-4" />
        <div className="flex gap-2">
          <Skeleton className="w-16 h-6" />
          <Skeleton className="w-20 h-6" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function BlogFeed() {
  const {
    data: blogs = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <BlogSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <p className="text-red-500">Error loading blogs: {error.message}</p>;
  }

  if (blogs.length === 0) {
    return (
      <Card className="border-0 bg-card">
        <CardContent className="p-12 text-center">
          <div className="space-y-4">
            <div className="text-6xl">📝</div>
            <h3 className="text-xl font-semibold">No posts yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Be the first to share something with the community! Click "Create Post" to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
