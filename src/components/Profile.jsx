import React, { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { auth } from "@/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUser = () => {
      const currentUser = auth.currentUser;
      setUser(currentUser);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog")
        .select("*")
        .eq("author_id", user.uid)
        .order("publishedat", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, [user]);

  if (!user) return <p>Please login to see your profile.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Profile: {user.displayName}</h1>
      <img src={user.photoURL} alt="avatar" className="w-24 h-24 rounded-full mb-4" />
      <p>Email: {user.email}</p>

      <h2 className="mt-8 text-2xl font-semibold">Your Blog Posts</h2>
      {posts.length === 0 ? (
        <p>You have no posts yet.</p>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="mb-4">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{post.content.slice(0, 200)}...</p>
              <p className="text-sm text-muted-foreground">
                Published on: {post.publishedat ? new Date(post.publishedat).toLocaleDateString() : "Not published"}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
