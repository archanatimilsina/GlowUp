import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaArrowLeft } from 'react-icons/fa'; 
import useUserStore from '../../store/useUserStore';

const CreatePost = () => {
  const [postText, setPostText] = useState("");
  const [title, setTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { email, profilePic, username } = useUserStore(); 

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !postText.trim()) {
      alert("Please add a title and some content!");
      return;
    }

    setLoading(true);

    let base64Image = null;
    if (selectedImage) {
      base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(selectedImage);
      });
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/forum/posts/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,       
          title: title,
          content: postText,
          image_data: base64Image 
        }),
      });

      if (response.ok) {
        alert("Post shared successfully!");
        navigate('/forum/disscussionForum'); 
      } else {
        const errorData = await response.json();
        alert(`Failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Is Django running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <BackButton onClick={() => navigate('/disscussionForum')}>
        <FaArrowLeft /> Back to Forum
      </BackButton>

      <header className="form-header">
        <h1>Create New Post</h1>
        <p>Share your journey with the GlowUp community.</p>
      </header>

      <FormGrid onSubmit={handleSubmit}>
        <InputSection>
          <FormGroup>
            <label>Title</label>
            <input 
              type="text" 
              placeholder="Give your post a title..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>What's on your mind?</label>
            <textarea 
              placeholder="Tell us more about your skincare journey..." 
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
          </FormGroup>

          <UploadBox>
            <label htmlFor="post-image" className="upload-label">
              {selectedImage ? "✅ Image Selected" : "📷 Add Photo to Post"}
            </label>
            <input 
              id="post-image" 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ display: 'none' }} 
            />
          </UploadBox>

          <ActionContainer>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Posting..." : "Post to Community →"}
            </button>
            <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </ActionContainer>
        </InputSection>

        <PreviewSection>
          <div className="preview-label">LIVE PREVIEW</div>
          <div className="preview-card">
            <div className="user-info">
               <AvatarWrapper>
                {profilePic ? (
                  <UserImg src={profilePic} alt="Profile" />
                ) : (
                  <FaUserCircle size={40} color="#fce8e6" />
                )}
              </AvatarWrapper>
               <div>
                  <div className="user-name">{username || "Your Account"}</div>
                  <div className="post-date">Just now</div>
               </div>
            </div>

            <h3 className="preview-title">{title || "Your Post Title"}</h3>
            <p className="preview-content">{postText || "Your content will appear here..."}</p>
            
            {selectedImage && (
              <div className="image-box">
                <img 
                  src={URL.createObjectURL(selectedImage)} 
                  alt="Selected Preview" 
                />
              </div>
            )}
          </div>
        </PreviewSection>
      </FormGrid>
    </PageContainer>
  );
};

export default CreatePost;

// --- STYLES ---

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 20px auto 40px;
  padding: 0 20px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: #fffafa; /* Light Snowy Peach background */
  min-height: 100vh;
  
  .form-header {
    margin-bottom: 40px;
    h1 { font-size: 32px; color: #d16b5f; font-weight: 700; }
    p { color: #a38b88; }
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f1897d; /* Signature Color */
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 16px;
  padding: 0;
  transition: all 0.2s;

  &:hover {
    color: #d16b5f;
    transform: translateX(-3px);
  }
`;

const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const InputSection = styled.div`
  background: white;
  padding: 30px;
  border-radius: 24px;
  border: 1px solid #fce8e6;
  box-shadow: 0 10px 30px rgba(241, 137, 125, 0.05);
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
  label { display: block; font-weight: 700; color: #d16b5f; margin-bottom: 8px; }
  input, textarea {
    width: 100%; padding: 15px; border-radius: 12px; border: 1.5px solid #fce8e6;
    background: #fffafa; font-size: 15px; outline: none;
    color: #4A5568;
    transition: all 0.3s ease;
    
    &:focus { 
        border-color: #f1897d; 
        background: white;
        box-shadow: 0 0 0 4px rgba(241, 137, 125, 0.1);
    }
  }
  textarea { height: 180px; resize: none; }
`;

const UploadBox = styled.div`
  margin-bottom: 30px;
  .upload-label {
    display: block; text-align: center; padding: 25px; border: 2px dashed #fce8e6;
    border-radius: 15px; cursor: pointer; color: #f1897d; font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover { 
        background: #fff8f7; 
        border-color: #f1897d;
    }
  }
`;

const PreviewSection = styled.div`
  .preview-label {
    font-size: 12px; font-weight: 800; color: #d16b5f; margin-bottom: 15px; letter-spacing: 1px;
    opacity: 0.7;
  }

  .preview-card {
    background: white;
    padding: 24px;
    border-radius: 24px;
    border: 1px solid #fce8e6;
    box-shadow: 0 15px 35px rgba(241, 137, 125, 0.08);

    .user-info {
        display: flex; gap: 12px; margin-bottom: 20px;
        .user-name { font-weight: 700; font-size: 14px; color: #d16b5f; }
        .post-date { font-size: 12px; color: #a38b88; }
    }

    .preview-title { font-size: 20px; color: #d16b5f; margin-bottom: 12px; font-weight: 700; }
    .preview-content { font-size: 15px; color: #4A5568; line-height: 1.6; margin-bottom: 20px; }

    .image-box {
      width: 100%;
      height: 350px;
      border-radius: 18px;
      overflow: hidden;
      background-color: #fffafa;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 100%; 
        height: 100%; 
        object-fit: cover;
        object-position: center;
      }
    }
  }
`;

const ActionContainer = styled.div`
  display: flex; gap: 15px;
  .btn-submit {
    flex: 2; padding: 16px; border-radius: 30px; border: none;
    background: #f1897d; color: white; font-weight: 700; cursor: pointer;
    box-shadow: 0 8px 15px rgba(241, 137, 125, 0.2);
    transition: all 0.3s ease;
    
    &:hover { 
        background: #d16b5f; 
        transform: translateY(-2px);
    }
    &:disabled { background: #fce8e6; cursor: not-allowed; box-shadow: none; }
  }
  .btn-cancel {
    flex: 1; padding: 16px; border-radius: 30px; border: 1.5px solid #fce8e6;
    background: white; color: #a38b88; font-weight: 700; cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: #fff8f7;
        color: #d16b5f;
    }
  }
`;

const AvatarWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #fffafa;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #fce8e6;
`;

const UserImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;