import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CreatePost from './components/CreatePost';
import TodoApp from './components/TodoApp';
import CreateAccount from './components/CreateAccount';
import Profile from './components/Profile';
import Home from './components/Home';
import BlogDetail from './components/BlogDetail';
import ActiveDiscussions from './components/ActiveDiscussions';
import BlogView from './components/BlogView';
import ThemeToggle from './components/ThemeToggle'; // 👈 Import ThemeToggle

const queryClient = new QueryClient();

function App() {
  const [userPosts, setUserPosts] = useState([]);

  const handlePostCreate = (newPost) => {
    setUserPosts((prev) => [newPost, ...prev]);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        {/* animated gradient blobs *
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/30 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/30 rounded-full filter blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
*/}
        {/* Header always visible */}
        <Header />

        {/* Theme toggle button fixed to top-right */}
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <Routes>
          {/* ✅ HOME PAGE — blog feed with sidebar and discussions */}
          <Route
            path="/"
            element={
              <div className="flex">
                <div className="hidden md:block">
                  <Sidebar />
                </div>
                <main className="flex-1 flex max-w-full">
                  <div className="flex-1 px-4 py-6">
                    <Home />
                  </div>
                  <div className="hidden xl:block w-80 px-4 py-6">
                    <ActiveDiscussions />
                  </div>
                </main>
              </div>
            }
          />

          {/* Blog detail full view */}
          <Route path="/blog/:id" element={<BlogDetail />} />

          {/* Create post */}
          <Route
            path="/create"
            element={
              <div className="relative z-10">
                <CreatePost onPostCreate={handlePostCreate} />
              </div>
            }
          />

          {/* Todos */}
          <Route
            path="/todos"
            element={
              <div className="relative z-10">
                <TodoApp />
              </div>
            }
          />

          {/* Signup / Account */}
          <Route path="/signup" element={<CreateAccount />} />
          <Route path="/profile" element={<Profile />} />

          {/* Blog full view */}
          <Route path="/blog/:id" element={<BlogView />} />
        </Routes>

        <Toaster position="top-right" />
      </div>
    </QueryClientProvider>
  );
}

export default App;
