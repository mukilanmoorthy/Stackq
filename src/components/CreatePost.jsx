import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase";
import { supabase } from "../supabase";

export default function CreatePost() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        toast.success(`Welcome, ${result.user.displayName}`);
        navigate("/create");
      }
    } catch (error) {
      if (error.code !== "auth/popup-closed-by-user") {
        toast.error("Login failed: " + error.message);
      }
    }
  };

  const uploadCover = async () => {
    if (!coverFile) return null;
    const ext = coverFile.name.split(".").pop();
    const filename = `${Date.now()}.${ext}`;
    const path = `blog-covers/${filename}`;

    const { error } = await supabase.storage.from("blog-covers").upload(path, coverFile);
    if (error) {
      toast.error("Image upload failed: " + error.message);
      return null;
    }

    const { data } = supabase.storage.from("blog-covers").getPublicUrl(path);
    return data?.publicUrl || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required.");
      return;
    }

    if (!user) {
      toast.error("You must be signed in to create a post.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Publishing post...");

    try {
      const coverUrl = await uploadCover();

      const { error } = await supabase.from("blog").insert([
        {
          title: title.trim(),
          content: content.trim(),
          cover_url: coverUrl,
          author_id: user.uid,
          author_name: user.displayName || "Anonymous",
          author_photo: user.photoURL || "https://via.placeholder.com/40",
          created_at: new Date().toISOString(),
          publishedat: new Date().toISOString(),
        },
      ]);

      if (error) {
        toast.error("Failed to publish post: " + error.message, { id: toastId });
      } else {
        toast.success("Post published successfully!", { id: toastId });
        setTitle("");
        setContent("");
        setCoverFile(null);
        navigate("/");
      }
    } catch (err) {
      toast.error("Something went wrong: " + err.message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return <p className="p-6 text-center">Loading user info...</p>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {!user ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Please Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGoogleSignUp} className="w-full">
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center mb-6 space-x-4">
            <img
              src={user.photoURL || "https://via.placeholder.com/50"}
              alt="avatar"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold">{user.displayName || "Anonymous"}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Blog Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label>Title *</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />

                <Label>Content *</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                />

                <Label className="flex items-center">
                  <ImageIcon className="h-4 w-4 mr-2" /> Cover Image
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files[0])}
                />

                <Button type="submit" disabled={isSubmitting} className="mt-4">
                  {isSubmitting ? "Saving..." : "Publish Post"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </>
      )}
    </div>
  );
}
