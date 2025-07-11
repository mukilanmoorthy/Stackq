// File: src/components/BlogCard.jsx

import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Eye,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BlogCard({ blog }) {
  const navigate = useNavigate();

  if (!blog) return null;

  const handleOpenBlog = () => {
    navigate(`/blog/${blog.id}`);
  };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    navigate(`/blog/${blog.id}#comments`);
  };

  const handleReadMore = (e) => {
    e.stopPropagation();
    navigate(`/blog/${blog.id}`);
  };

  return (
    <Card
      onClick={handleOpenBlog}
      className="border p-4 rounded-md shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <img
            src={blog.author?.avatar || 'https://via.placeholder.com/40'}
            alt={blog.author?.name || 'Author'}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium">{blog.author?.name || 'Unknown'}</p>
            <p className="text-xs text-muted-foreground">{blog.publishedAt}</p>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </CardHeader>

      <CardContent>
        <h2 className="text-lg font-semibold mb-1">{blog.title}</h2>
        <p className="text-muted-foreground text-sm mb-2">{blog.excerpt}...</p>

        {Array.isArray(blog.tags) && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {blog.tags.map((tag, i) => (
              <Badge key={i} variant="secondary">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground pt-2 border-t">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Heart className="h-4 w-4" /> {blog.reactions || 0}
          </span>
          <button className="flex items-center gap-1" onClick={handleCommentClick}>
            <MessageCircle className="h-4 w-4" /> {blog.comments || 0}
          </button>
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" /> {blog.views || 0}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
            <Bookmark className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={handleReadMore}>
            Read More
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
