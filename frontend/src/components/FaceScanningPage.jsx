import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import Alertbox1 from "./elementComponent/ConfettiAlert"; 
import { FaLightbulb, FaCamera, FaTimesCircle } from 'react-icons/fa';

const FaceScanningPage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [detectedTone, setDetectedTone] = useState("");

  const { email, setUserData } = useUserStore();

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleStartAnalysis = async (e) => {
    e.preventDefault(); 

    if (!selectedImage) {
      alert("Please upload an image first!");
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    
    reader.onloadend = async () => {
      const base64data = reader.result;

      try {
        const response = await fetch('http://127.0.0.1:8000/skintoneAnalysis/upload', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64data }),
        });

        const data = await response.json();
        
        if (data.tone_name) {
          const updateResponse = await fetch('http://127.0.0.1:8000/skintoneAnalysis/skintoneupdate/', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: email,
              skin_tone: data.tone_name 
            }),
          });

          if (updateResponse.ok) {
            setUserData({
              skin_tone: data.tone_name,
              skinTone: data.tone_name   
            });
            
            setDetectedTone(data.tone_name);
            setIsPopupOpen(true);
          }
          setSelectedImage(null); 
        }

      } catch (error) {
        console.error("Error:", error);
        alert("Failed to complete analysis.");
      } finally {
        setLoading(false);
      }
    };
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    navigate("/faceScanPage"); 
  };

  return (
    <FaceScanContainer>
      <Alertbox1 
        skin_tone={detectedTone} 
        isOpen={isPopupOpen} 
        onClose={handleClosePopup} 
      />

      <div className="content">
        <div className="badge">🌿 AI Skin Analysis</div>
        <h1>Facial Image Scan</h1>
        <p className="description">
          Discover your true skin tone with precision. Our advanced AI analyzes 
          pixel-level color data to help you identify your unique complexion 
          profile within seconds.
        </p>

        <TipsSection>
            <h3><FaLightbulb color="#f1897d" /> For Better Accuracy:</h3>
            <ul>
                <li><strong>Natural Light:</strong> Face a window. Avoid yellow bulbs or dark shadows.</li>
                <li><strong>Clear View:</strong> Ensure your hair or glasses aren't covering your forehead or cheeks.</li>
                <li><strong>No Filters:</strong> Use a raw camera photo. Makeup or filters will confuse the AI sensors.</li>
            </ul>
        </TipsSection>

        <div className="upload-section">
          <form onSubmit={handleStartAnalysis}>
            <label htmlFor="file-upload" className="custom-file-upload">
              {selectedImage ? "✅ Image Selected" : "📷 Choose Skin Photo"}
            </label>
            <input 
              id="file-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              style={{ display: 'none' }} 
            />
            
            <div className="buttons">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Analyzing Sensors..." : "Start Analysis →"}
              </button>
              {selectedImage && (
                  <button type="button" className="btn-clear" onClick={() => setSelectedImage(null)}>
                      <FaTimesCircle /> Clear
                  </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="scan-card">
        <div className="preview-label">IMAGE SENSOR PREVIEW</div>
        
        <div className="image-wrapper">
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : "https://img.freepik.com/premium-vector/biometric-identification-face-recognition-system-concept-face-scanning-process-mobile-phone-digital-verification-facial-landmarks-detection-vector-illustration_2175-1025.jpg"}
              alt="AI Face Scan"
              className={selectedImage ? "scan-image" : "scan-image placeholder"}
            />
            {/* The scanning line only appears when an image IS selected, to show it's working */}
            {selectedImage && loading && <div className="scan-line"></div>}
        </div>

        <div className="status">
          <div>
            <small>AI DETECTOR STATUS</small>
            <p>{selectedImage ? (loading ? "Scanning Melanin..." : "Ready to Process") : "Awaiting Input"}</p>
          </div>
          <div className="status-icon">
              <FaCamera color="#f1897d" />
          </div>
        </div>
      </div>
    </FaceScanContainer>
  );
};

export default FaceScanningPage;

// --- STYLES ---

const scanMove = keyframes`
  0% { top: 0%; }
  100% { top: 100%; }
`;

const TipsSection = styled.div`
    background: #fff;
    border: 1px solid #fce8e6;
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 30px;
    text-align: left;

    h3 {
        font-size: 16px;
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        color: #d16b5f;
    }

    ul { list-style: none; padding: 0; margin: 0; }
    li {
        font-size: 13px;
        color: #64748B;
        margin-bottom: 8px;
        line-height: 1.4;
        position: relative;
        padding-left: 15px;
        &::before { content: "•"; color: #f1897d; position: absolute; left: 0; font-weight: bold; }
        strong { color: #4A5568; }
    }
`;

const FaceScanContainer = styled.main`
    width: 90%;
    display: flex;
    align-items: center;
    background: #fffafa;
    color: #4A5568;
    justify-content: center;
    margin: 50px auto;
    border-radius: 24px;
    min-height: 600px;
    padding: 40px;
    gap: 60px;
    box-shadow: 0 15px 40px rgba(241, 137, 125, 0.08);
    border: 1px solid #fce8e6;

    .content { max-width: 500px; }

    .custom-file-upload { 
        display: inline-block; padding: 12px 24px; cursor: pointer; background: white; 
        border: 2px dashed #fce8e6; border-radius: 12px; margin-bottom: 20px; 
        font-size: 14px; color: #f1897d; font-weight: 600; transition: all 0.2s;
        &:hover { background: #fff8f7; border-color: #f1897d; }
    }

    .badge { 
        display: inline-flex; align-items: center; gap: 6px; background: #fff5f4; 
        color: #d16b5f; padding: 8px 18px; border-radius: 30px; font-size: 13px; 
        font-weight: 700; margin-bottom: 24px; border: 1px solid #fce8e6;
    }

    h1 { font-size: 42px; font-weight: 800; line-height: 1.1; margin-bottom: 18px; color: #d16b5f; }
    .description { font-size: 16px; color: #a38b88; line-height: 1.6; margin-bottom: 30px; }

    .buttons { display: flex; gap: 15px; align-items: center; }

    .btn-primary { 
        background: #f1897d; color: #fff; border: none; padding: 16px 32px; 
        border-radius: 30px; font-size: 15px; font-weight: 700; cursor: pointer; 
        transition: all 0.3s ease; box-shadow: 0 8px 15px rgba(241, 137, 125, 0.2);
        &:hover { background: #d16b5f; transform: translateY(-2px); }
        &:disabled { background: #fce8e6; cursor: not-allowed; }
    }

    .btn-clear {
        background: none; border: none; color: #a38b88; font-size: 14px; 
        font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px;
        &:hover { color: #d16b5f; }
    }

    .scan-card { 
        width: 420px; background: #ffffff; border-radius: 28px; padding: 25px; 
        box-shadow: 0 20px 50px rgba(241, 137, 125, 0.12); border: 1px solid #fce8e6;
    }

    .image-wrapper {
        position: relative;
        width: 100%;
        height: 350px;
        border-radius: 18px;
        overflow: hidden;
        background: #fff; 
    }

    .scan-image { 
        width: 100%; height: 100%; object-fit: cover; display: block; 
    }

    .placeholder {
        opacity: 0.6;
        filter: sepia(0.2) saturate(1.2); /* Gives it a warmer, peach-compatible tone */
    }

    .scan-line {
        position: absolute;
        width: 100%;
        height: 4px;
        background: linear-gradient(to bottom, transparent, #f1897d);
        box-shadow: 0 2px 10px #f1897d;
        top: 0;
        z-index: 2;
        animation: ${scanMove} 2s infinite ease-in-out;
    }

    .preview-label {
        font-size: 10px; font-weight: 800; color: #f1897d; letter-spacing: 1.5px; 
        margin-bottom: 15px; text-align: center; opacity: 0.7;
    }

    .status { 
        margin-top: 24px; padding-top: 18px; border-top: 1px solid #fce8e6; 
        display: flex; justify-content: space-between; align-items: center; 
    }

    .status small { font-size: 10px; letter-spacing: 1px; color: #a38b88; font-weight: 700; }
    .status p { font-size: 15px; font-weight: 600; margin-top: 4px; color: #4A5568; }

    .status-icon { 
        background: #fff5f4; width: 40px; height: 40px; border-radius: 50%; 
        display: flex; align-items: center; justify-content: center; border: 1px solid #fce8e6;
    }

    @media (max-width: 900px) { 
        flex-direction: column; padding: 40px 20px; height: auto;
        .content { text-align: center; max-width: 100%; } 
        .buttons { justify-content: center; } 
        h1 { font-size: 34px; } 
        .scan-card { width: 100%; max-width: 420px; } 
    }
`;