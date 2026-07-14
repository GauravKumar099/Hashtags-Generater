import { Sparkles, Calendar, User, Clock, ArrowRight, ArrowLeft, Tag, BookOpen, Plus, Trash2, Edit } from "lucide-react";
import React, { useState } from "react";
import { BlogPost } from "../types";
import AdSpace from "./AdSpace";

interface BlogSectionProps {
  isAdmin: boolean;
  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
}

export default function BlogSection({ isAdmin, blogPosts, setBlogPosts }: BlogSectionProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // State to manage creation/editing of blog posts
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  
  // Blog Post form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Instagram Hashtags");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [readTime, setReadTime] = useState("5 min read");

  const categories = [
    "All",
    "Instagram Hashtags",
    "YouTube Tips",
    "Facebook Tips",
    "TikTok Growth",
    "AI Tools",
    "Social Media Marketing"
  ];

  // Save / edit post
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    if (editingPost) {
      // Update existing post
      setBlogPosts(prev => prev.map(p => p.id === editingPost.id ? {
        ...p,
        title,
        category,
        content,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=600&q=80",
        readTime
      } : p));
      
      // Update selectedPost if currently reading it
      if (selectedPost?.id === editingPost.id) {
        setSelectedPost({
          ...selectedPost,
          title,
          category,
          content,
          imageUrl: imageUrl || "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=600&q=80",
          readTime
        });
      }
    } else {
      // Add new post
      const newPost: BlogPost = {
        id: Math.random().toString(36).substring(7),
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category,
        content,
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        author: "HashtagAI Editor",
        readTime,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=600&q=80"
      };
      setBlogPosts(prev => [newPost, ...prev]);
    }

    // Reset Form
    setIsFormOpen(false);
    setEditingPost(null);
    setTitle("");
    setCategory("Instagram Hashtags");
    setContent("");
    setImageUrl("");
    setReadTime("5 min read");
  };

  const handleEditClick = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setCategory(post.category);
    setContent(post.content);
    setImageUrl(post.imageUrl || "");
    setReadTime(post.readTime);
    setIsFormOpen(true);
  };

  const handleDeletePost = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this article?")) {
      setBlogPosts(prev => prev.filter(p => p.id !== id));
      if (selectedPost?.id === id) {
        setSelectedPost(null);
      }
    }
  };

  const filteredPosts = blogPosts.filter(p => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Blog Hero Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
          HashtagAI Knowledge Hub
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Pro strategies, social SEO updates, viral hashtag masterclasses, and algorithm blueprints to boost your impressions.
        </p>

        {isAdmin && (
          <button
            onClick={() => {
              setEditingPost(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Publish New Article</span>
          </button>
        )}
      </div>

      {/* Editor / Publisher Dialog */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              {editingPost ? "Edit Blog Article" : "Write & Publish New Article"}
            </h2>

            <form onSubmit={handleSavePost} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Article Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g., 10 Hidden Instagram Algorithm Shifts in 2026"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none dark:text-slate-300"
                  >
                    {categories.slice(1).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Unsplash Image URL (Optional)</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Estimate Read Time</label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    placeholder="5 min read"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 focus:outline-none dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Full Markdown / Text Article Content</label>
                <textarea
                  required
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Draft your high-converting content marketing article here..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 focus:outline-none dark:text-white font-sans leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-150 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow cursor-pointer"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedPost ? (
        /* DETAILED ARTICLE READER VIEW */
        <article className="glass-panel rounded-2xl border border-slate-200/50 dark:border-slate-800 overflow-hidden shadow-lg">
          
          <div className="h-64 sm:h-96 w-full relative">
            <img
              src={selectedPost.imageUrl}
              alt={selectedPost.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 left-4 bg-black/50 text-white rounded-xl p-2.5 hover:bg-black/80 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Knowledge Hub</span>
            </button>
          </div>

          <div className="p-6 sm:p-10 space-y-6">
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 py-1 px-2.5 rounded font-bold uppercase tracking-wider text-[10px]">
                <Tag className="h-3 w-3" /> {selectedPost.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {selectedPost.date}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> {selectedPost.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {selectedPost.readTime}
              </span>
            </div>

            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-950 dark:text-white leading-tight">
              {selectedPost.title}
            </h2>

            {/* Simulated Banner space inside article */}
            <AdSpace id="blog-in-article" type="banner" />

            <div className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-sm sm:text-base whitespace-pre-line space-y-4">
              {selectedPost.content}
            </div>

            {/* Admin Controls on article detail */}
            {isAdmin && (
              <div className="flex justify-end gap-2.5 pt-6 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => handleEditClick(selectedPost)}
                  className="flex items-center gap-1 py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit Article</span>
                </button>
                <button
                  onClick={(e) => handleDeletePost(selectedPost.id, e)}
                  className="flex items-center gap-1 py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Article</span>
                </button>
              </div>
            )}

          </div>

        </article>
      ) : (
        /* BLOG GRID LIST VIEW */
        <div className="space-y-6">
          
          {/* Categories Filters & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Horizontal Filter Scroll */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 hover:text-indigo-600 dark:text-slate-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Simple Search bar */}
            <input
              type="text"
              placeholder="Search knowledge hub..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl py-2 px-4 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full md:max-w-xs dark:text-white"
            />

          </div>

          {/* Grid Layout */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-2xl border border-slate-200/50 dark:border-slate-800">
              <BookOpen className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No blog posts found matching your search.</p>
              <p className="text-xs text-slate-400">Try adjusting your category filter or keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="group glass-panel rounded-2xl border border-slate-200/50 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="h-44 w-full relative overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 left-2 bg-black/60 text-white text-[9px] font-bold uppercase tracking-wider py-1 px-2 rounded-md backdrop-blur">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                        <span className="flex items-center gap-0.5"><Calendar className="h-3 w-3" /> {post.date}</span>
                        <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {post.readTime}</span>
                      </div>
                      
                      <h3 className="font-display font-semibold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {post.content}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex justify-between items-center border-t border-slate-100 dark:border-slate-800/50 mt-4">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Read Strategy</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>

                    {/* Admin delete inline on card list */}
                    {isAdmin && (
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditClick(post); }}
                          className="p-1 text-indigo-500 hover:text-indigo-700 bg-indigo-50 rounded"
                          title="Edit Card"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeletePost(post.id, e)}
                          className="p-1 text-red-500 hover:text-red-700 bg-red-50 rounded"
                          title="Delete Card"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Ad block below Blog index */}
          <AdSpace id="blog-footer-responsive" type="banner" />

        </div>
      )}

    </div>
  );
}
