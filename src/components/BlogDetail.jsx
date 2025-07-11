// File: src/pages/BlogDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabase';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, [id]);

  // ✅ Safe and stable dependency array
  useEffect(() => {
    const viewedKey = `viewed-${id}`;
    if (blog?.id && !localStorage.getItem(viewedKey)) {
      supabase
        .from('blog')
        .update({ views: (blog.views || 0) + 1 })
        .eq('id', id)
        .then(({ error }) => {
          if (!error) {
            localStorage.setItem(viewedKey, 'true');
            setBlog((prev) => ({
              ...prev,
              views: (prev.views || 0) + 1,
            }));
          }
        });
    }
  }, [blog?.id, id]);

  const fetchBlog = async () => {
    const { data, error } = await supabase
      .from('blog')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error(error.message);
    } else {
      setBlog(data);
      setLikes(data.reactions || 0);
    }
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('blog_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setComments(data);
    }
  };

  const handleLike = async () => {
    if (liked) return;

    const { error } = await supabase
      .from('blog')
      .update({ reactions: likes + 1 })
      .eq('id', id);

    if (!error) {
      setLiked(true);
      setLikes((prev) => prev + 1);
    } else {
      toast.error('Failed to like post');
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const { error } = await supabase
      .from('comments')
      .insert({ blog_id: id, text: newComment });

    if (!error) {
      setNewComment('');
      fetchComments();
    } else {
      toast.error('Failed to add comment');
    }
  };

  if (!blog) return <p className="p-6">Loading...</p>;

  return (
    <div className="container max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{blog.title}</CardTitle>
          <div className="flex items-center gap-3 mt-2">
            <img
              src={blog.author_photo || 'https://via.placeholder.com/40'}
              className="h-8 w-8 rounded-full"
              alt="avatar"
            />
            <span className="text-sm text-muted-foreground">
              {blog.author_name} •{' '}
              {new Date(blog.publishedat).toLocaleDateString()}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-base mb-4 whitespace-pre-wrap">{blog.content}</p>
          {blog.cover_url && (
            <img
              src={blog.cover_url}
              alt="cover"
              className="rounded-md w-full mt-4"
            />
          )}
        </CardContent>
        <CardFooter className="flex gap-6 text-sm text-muted-foreground">
          <div
            onClick={handleLike}
            className={`cursor-pointer flex items-center gap-1 ${
              liked ? 'text-red-500' : ''
            }`}
          >
            <Heart className="w-4 h-4" /> {likes}
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" /> {blog.views || 0}
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" /> {comments.length}
          </div>
        </CardFooter>
      </Card>

      {/* Comments Section */}
      <Card id="comments">
        <CardHeader>
          <CardTitle className="text-lg">Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="border-b pb-2">
              <p className="text-sm">{c.text}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(c.created_at).toLocaleString()}
              </p>
            </div>
          ))}

          <div className="space-y-2 mt-4">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button onClick={handleCommentSubmit}>Post Comment</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
