import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Send, Search, ArrowLeft, User, LogOut, ChevronDown, Trash2, Plus, MoreHorizontal } from "lucide-react"; 
import useUserStore from "../../store/useUserStore";

const DiscussionForum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0); 
  const [searchQuery, setSearchQuery] = useState("");
  const [newComment, setNewComment] = useState({});
  const [showDropdown, setShowDropdown] = useState(false); 
  const [feedType, setFeedType] = useState("all"); 
  
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { email, profilePic, username, logout } = useUserStore(); 

  const fetchUserCount = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/user-count/`);
      const data = await response.json();
      setUserCount(data.total_users || 0);
    } catch (error) {
      console.error("Error counting users:", error);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/forum/posts/?email=${email}`);
      const data = await response.json();
      setPosts(data.map(p => ({ ...p, showComments: false })));
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (email) {
      fetchPosts();
      fetchUserCount();
    }
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [email, fetchPosts, fetchUserCount]);

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/forum/posts/${postId}/like/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });
      if (response.ok) {
        const result = await response.json();
        setPosts(posts.map(p => 
          p.id === postId ? { ...p, total_likes: result.total_likes, isLiked: result.isLiked } : p
        ));
      }
    } catch (error) { console.error(error); }
  };

  const handleAddComment = async (postId) => {
    const text = newComment[postId];
    if (!text) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/forum/posts/${postId}/comment/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, text: text })
      });
      if (response.ok) {
        setNewComment({ ...newComment, [postId]: "" });
        fetchPosts(); 
      }
    } catch (error) { console.error(error); }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/forum/posts/${postId}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setPosts(posts.filter(p => p.id !== postId));
      }
    } catch (error) { console.error("Delete failed:", error); }
  };

  const toggleComments = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, showComments: !post.showComments } : post
    ));
  };

  const filteredPosts = posts
    .filter(post => (feedType === "mine" ? post.author_email === email : true))
    .filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <Container>
      <nav className="navbar">
        <div className="nav-left">
          <button className="back-btn" onClick={() => navigate("/")}><ArrowLeft size={22} /></button>
          <div className="logo" onClick={() => navigate("/")}>GlowUp<span>Discuss</span></div>
        </div>

        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search skincare tips, routines..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="nav-right">
           <button className="create-btn" onClick={() => navigate("/createForum")}>
             <Plus size={18} /> Create Post
           </button>
           
           <div className="profile-zone" ref={dropdownRef}>
              <div className="avatar-wrapper" onClick={() => setShowDropdown(!showDropdown)}>
                <img 
                    src={profilePic ? profilePic : `https://ui-avatars.com/api/?name=${username}&background=b76e79&color=fff`} 
                    alt="User" 
                />
                <ChevronDown size={14} color="#666" />
              </div>

              {showDropdown && (
                <DropdownMenu>
                  <div className="user-info-header">
                    <p className="label">Account</p>
                    <p className="email-text">{username || email}</p>
                  </div>
                  <hr />
                  <button className="menu-item" onClick={() => {setFeedType("mine"); setShowDropdown(false);}}>
                    <User size={16} /> My Activity
                  </button>
                  <button className="menu-item logout" onClick={() => {logout(); navigate("/login");}}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </DropdownMenu>
              )}
           </div>
        </div>
      </nav>

      <div className="main-layout">
        <aside className="sidebar-left">
          <div className="filter-card">
            <h4>Feeds</h4>
            <div className={`nav-link ${feedType === 'all' ? 'active' : ''}`} onClick={() => setFeedType("all")}>
              <MessageCircle size={18} /> Global Community
            </div>
            <div className={`nav-link ${feedType === 'mine' ? 'active' : ''}`} onClick={() => setFeedType("mine")}>
              <User size={18} /> My Discussions
            </div>
          </div>
        </aside>

        <main className="content-area">
          <div className="content-header">
            <h2>{feedType === "all" ? "Community Feed" : "My Personal Feed"}</h2>
            <span>{filteredPosts.length} Discussions</span>
          </div>

          {loading ? (
            <div className="status-box">Softly gathering posts...</div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard key={post.id}>
                <div className="post-header">
                  <div className="author-info">
                    <img 
                      src={post.author_profile_pic 
                        ? `http://127.0.0.1:8000${post.author_profile_pic}` 
                        : `https://ui-avatars.com/api/?name=${post.author}&background=fce8e6&color=b76e79`} 
                      alt={post.author} 
                    />
                    <div className="meta">
                      <span className="author-name">{post.author}</span>
                      <span className="post-date">{new Date(post.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                    </div>
                  </div>
                  {post.author_email === email && (
                    <button className="options-btn" onClick={() => handleDeletePost(post.id)}>
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="post-content">
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                </div>

                {post.image && (
                  <div className="post-image-container">
                    <img src={`http://127.0.0.1:8000${post.image}`} alt="Community shared" />
                  </div>
                )}

                <div className="post-actions">
                  <button className={`action-pill ${post.isLiked ? 'liked' : ''}`} onClick={() => handleLike(post.id)}>
                    <Heart size={20} fill={post.isLiked ? "#B76E79" : "none"} />
                    <span>{post.total_likes}</span>
                  </button>
                  <button className="action-pill" onClick={() => toggleComments(post.id)}>
                    <MessageCircle size={20} />
                    <span>{post.comments?.length || 0}</span>
                  </button>
                </div>

                {post.showComments && (
                  <CommentSection>
                    <div className="comment-list">
                      {post.comments?.map(c => (
                        <div key={c.id} className="comment-item">
                          <span className="user">{c.user}</span>
                          <span className="text">{c.text}</span>
                        </div>
                      ))}
                    </div>
                    <div className="comment-input-area">
                      <input 
                        type="text" 
                        placeholder="Add a comment..." 
                        value={newComment[post.id] || ""} 
                        onChange={(e) => setNewComment({...newComment, [post.id]: e.target.value})} 
                      />
                      <button onClick={() => handleAddComment(post.id)}><Send size={18} /></button>
                    </div>
                  </CommentSection>
                )}
              </PostCard>
            ))
          ) : (
            <div className="status-box">No discussions found in this feed.</div>
          )}
        </main>

        <aside className="sidebar-right">
          <div className="stats-card">
            <h4>Community Insight</h4>
            <div className="stat-row">
              <label>Members</label>
              <span>{userCount}</span>
            </div>
            <div className="stat-row">
              <label>Your Input</label>
              <span>{posts.filter(p => p.author_email === email).length} posts</span>
            </div>
            <button className="action-button" onClick={() => navigate("/facescanpage")}>Analyze My Skin</button>
          </div>
        </aside>
      </div>
    </Container>
  );
};

export default DiscussionForum;

// --- STYLED COMPONENTS ---

const Container = styled.div`
  background: #fdf6f3;
  min-height: 100vh;
  color: #333;
  font-family: 'Poppins', sans-serif;

  .navbar {
    height: 80px; background: white; display: flex; align-items: center; justify-content: space-between;
    padding: 0 8%; border-bottom: 1px solid #eee; position: sticky; top: 0; z-index: 100;
    
    .nav-left { display: flex; align-items: center; gap: 20px;
      .back-btn { background: #fdf6f3; border: none; padding: 8px; border-radius: 50%; cursor: pointer; color: #b76e79; display: flex; }
      .logo { font-size: 1.4rem; font-weight: 700; color: #b76e79; cursor: pointer; span { font-weight: 300; color: #666; }}
    }

    .search-wrapper {
      position: relative; width: 35%;
      .search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #b76e79; }
      input { width: 100%; padding: 12px 20px 12px 45px; border-radius: 30px; border: 1px solid #f0f0f0; background: #fafafa; outline: none; transition: 0.3s;
        &:focus { border-color: #b76e79; background: white; box-shadow: 0 0 0 4px rgba(183,110,121,0.1); }
      }
    }

    .nav-right { display: flex; align-items: center; gap: 25px;
      .create-btn { background: #b76e79; color: white; border: none; padding: 10px 22px; border-radius: 30px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.3s;
        &:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(183,110,121,0.3); }
      }
      .avatar-wrapper { display: flex; align-items: center; gap: 10px; cursor: pointer; 
        img { width: 42px; height: 42px; border-radius: 50%; border: 2px solid #fdf6f3; object-fit: cover; }
      }
    }
  }

  .main-layout { display: flex; padding: 40px 8%; gap: 40px; max-width: 1400px; margin: 0 auto; }

  .sidebar-left { width: 220px; 
    .filter-card { background: white; padding: 25px; border-radius: 24px; border: 1px solid #f0f0f0; position: sticky; top: 120px; }
    h4 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1.5px; color: #999; margin-bottom: 20px; }
    .nav-link { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; cursor: pointer; color: #666; font-size: 0.95rem; transition: 0.2s; margin-bottom: 8px;
      &:hover { background: #fff5f6; color: #b76e79; }
      &.active { background: #b76e79; color: white; font-weight: 600; }
    }
  }

  .content-area { flex: 1; 
    .content-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 25px;
      h2 { font-size: 1.8rem; color: #b76e79; }
      span { color: #999; font-size: 0.9rem; }
    }
  }

  .sidebar-right { width: 300px;
    .stats-card { background: white; padding: 30px; border-radius: 24px; border: 1px solid #f0f0f0; position: sticky; top: 120px;
      h4 { color: #b76e79; margin-bottom: 25px; font-size: 1.1rem; }
      .stat-row { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 0.95rem; label { color: #777; } span { font-weight: 700; color: #333; }}
      .action-button { width: 100%; margin-top: 20px; background: #333; color: white; border: none; padding: 14px; border-radius: 15px; font-weight: 600; cursor: pointer; transition: 0.3s; &:hover { background: #000; }}
    }
  }

  .status-box { background: white; padding: 60px; text-align: center; border-radius: 24px; color: #999; border: 1px solid #f0f0f0; }
`;

const PostCard = styled.div`
  background: white;
  border-radius: 28px;
  border: 1px solid #f2f2f2;
  margin-bottom: 30px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);

  &:hover {
    box-shadow: 0 12px 35px rgba(183,110,121,0.08);
    transform: translateY(-4px);
  }

  .post-header {
    padding: 25px 30px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .author-info {
      display: flex;
      align-items: center;
      gap: 15px;
      img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #fff5f6; }
      .meta {
        display: flex;
        flex-direction: column;
        .author-name { font-weight: 700; color: #333; font-size: 1rem; }
        .post-date { font-size: 0.8rem; color: #aaa; }
      }
    }
    .options-btn { background: none; border: none; color: #ddd; cursor: pointer; transition: 0.2s; &:hover { color: #e74c3c; }}
  }

  .post-content {
    padding: 0 30px 20px;
    h3 { font-size: 1.4rem; color: #b76e79; margin-bottom: 12px; font-weight: 700; }
    p { color: #555; line-height: 1.8; font-size: 1rem; }
  }

  .post-image-container {
    padding: 0 20px;
    margin-bottom: 20px;
    img { 
      width: 100%; 
      max-height: 450px; 
      object-fit: cover; 
      border-radius: 20px;
      transition: 0.4s;
    }
  }

  .post-actions {
    padding: 0 30px 25px;
    display: flex;
    gap: 15px;

    .action-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: #fdf6f3;
      border: none;
      border-radius: 30px;
      color: #666;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: 0.3s;

      &:hover { background: #fff1f2; color: #b76e79; }
      &.liked { color: #b76e79; background: #fff1f2; }
      span { margin-top: 1px; }
    }
  }
`;

const CommentSection = styled.div`
  background: #fdfaf9;
  padding: 25px 30px;
  border-top: 1px solid #f9f0ed;

  .comment-list {
    margin-bottom: 20px;
    .comment-item {
      margin-bottom: 12px;
      font-size: 0.9rem;
      line-height: 1.5;
      .user { font-weight: 700; color: #b76e79; margin-right: 10px; }
      .text { color: #555; }
    }
  }

  .comment-input-area {
    display: flex;
    gap: 12px;
    background: white;
    padding: 6px 6px 6px 20px;
    border-radius: 50px;
    border: 1px solid #eee;

    input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 0.9rem;
      background: transparent;
    }

    button {
      background: #b76e79;
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.2s;
      &:hover { transform: scale(1.05); background: #a85d68; }
    }
  }
`;

const DropdownMenu = styled.div`
  position: absolute; top: 60px; right: 0; width: 240px; background: white; border-radius: 18px; 
  box-shadow: 0 15px 40px rgba(0,0,0,0.1); border: 1px solid #f0f0f0; overflow: hidden; padding: 10px 0; z-index: 200;
  .user-info-header { padding: 15px 20px; .label { font-size: 0.7rem; text-transform: uppercase; color: #bbb; letter-spacing: 1px; } .email-text { font-size: 0.9rem; font-weight: 700; color: #b76e79; }}
  hr { border: none; border-top: 1px solid #f5f5f5; margin: 10px 0; }
  .menu-item { width: 100%; padding: 12px 20px; border: none; background: none; display: flex; align-items: center; gap: 12px; color: #555; font-size: 0.9rem; cursor: pointer; transition: 0.2s;
    &:hover { background: #fff5f6; color: #b76e79; }
    &.logout { color: #e74c3c; }
  }
`;