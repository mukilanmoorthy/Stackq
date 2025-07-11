// File: src/pages/BlogView.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Heart,
  MessageCircle,
  Eye,
} from 'lucide-react';

export default function BlogView() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog') // ✅ use correct table name
          .select(`
            id,
            title,
            content,
            cover_url,
            published_at,
            reactions,
            comments,
            views,
            tags,
            author_name,
            author_photo
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setBlog(data);

        // ✅ Increment view count
        await supabase
          .from('blog')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', id);
      } catch (err) {
        console.error('Error loading blog:', err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [id]);

  if (loading || !blog) {
    return (
      <Card className="p-6 max-w-3xl mx-auto mt-10">
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-3xl mx-auto mt-10">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <img
            src={blog.author_photo || 'https://via.placeholder.com/40'}
            alt="Author"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-sm">{blog.author_name || 'Unknown'}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(blog.published_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">{blog.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {blog.cover_url && (
          <img
            src={blog.cover_url}
            alt="Cover"
            className="w-full rounded-md max-h-[300px] object-cover"
          />
        )}

        {Array.isArray(blog.tags) && blog.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {blog.tags.map((tag, i) => (
              <Badge key={i} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <p className="text-base text-gray-700 whitespace-pre-line">{blog.content}</p>
      </CardContent>

      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground pt-4 border-t mt-6">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Heart className="h-4 w-4" /> {blog.reactions || 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" /> {blog.comments || 0}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" /> {blog.views || 0}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
