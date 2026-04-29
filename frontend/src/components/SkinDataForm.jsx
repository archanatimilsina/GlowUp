import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from "react-router-dom";
import useUserStore from '../store/useUserStore';

const SkinDataForm = () => {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  
  const { email, setUserData } = useUserStore();

  const [selectedSkinTypes, setSelectedSkinTypes] = useState([]);
  const [selectedConcerns, setSelectedConcerns] = useState([]);

  const primaryConcerns = ["Moisturizing", "Soothing", "Pore Care", "Acne Spot", "Hydrating"];
  
  const extraConcerns = [
    "Oil Control", "Anti-Aging", "Brightening", "Skin Barrier Repair", 
    "Dark Spots", "UV Protection", "No Whitecast", "Balancing", "Refreshing"
  ];

  const handleToggle = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item)); 
    } else {
      setList([...list, item]); 
    }
  };

  const handleUpdate = async () => {
    if (selectedSkinTypes.length === 0 || selectedConcerns.length === 0) {
      alert("Please tell us a bit about your skin first! Select a type and a concern.");
      return; 
    }

    const skinTypeStr = selectedSkinTypes.join(", ");
    const concernsStr = selectedConcerns.join(", ");

    const UserSkinData = {
      email: email,
      skin_type: skinTypeStr, 
      skin_concerns: concernsStr
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/update-skin/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(UserSkinData),
      });

      if (response.ok) {
        setUserData({ 
            skin_type: skinTypeStr,    
            skinType: skinTypeStr,     
            skin_concerns: concernsStr, 
            skinConcerns: concernsStr  
        });

        alert("Your skin profile has been beautifully updated! ✨");
        navigate("/profile"); 
      } else {
        alert("We couldn't reach our beauty experts. Please try again!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Connection lost. Please check your internet.");
    }
  };

  return (
    <SkinDataContainer>
      <div className="skin-form-container slide-in">
        <div className="form-header">
          <h1>Tell us about your skin</h1>
          {/* <p className="subtitle">
            Every face is unique. By sharing your skin type, we can better understand 
            which textures and ingredients will make you glow.
          </p> */}
        </div>
        
        <SectionTitle>Your Skin Type</SectionTitle>
        {/* <p className="hint-text">Choose the one that best describes your skin most of the time.</p> */}
        
        <div className="grid">
          {["Normal", "Dry", "Oily", "Combination", "Sensitive"].map((t) => (
            <label key={t}>
              <input 
                type="checkbox" 
                checked={selectedSkinTypes.includes(t)}
                onChange={() => handleToggle(t, selectedSkinTypes, setSelectedSkinTypes)}
              />
              <div className="card">
                <span className="dot">•</span> {t}
              </div>
            </label>
          ))}
        </div>

        <SectionTitle style={{ marginTop: 50 }}>Targeted Concerns</SectionTitle>
        {/* <p className="hint-text">What are your main goals today? Select all that apply.</p> */}
        
        <div className="pills">
          {primaryConcerns.map((c) => (
            <label key={c}>
              <input 
                type="checkbox" 
                checked={selectedConcerns.includes(c)}
                onChange={() => handleToggle(c, selectedConcerns, setSelectedConcerns)}
              />
              <div className="pill">{c}</div>
            </label>
          ))}

          {showMore && extraConcerns.map((c) => (
            <label key={c}>
              <input 
                type="checkbox" 
                checked={selectedConcerns.includes(c)}
                onChange={() => handleToggle(c, selectedConcerns, setSelectedConcerns)}
              />
              <div className="pill">{c}</div>
            </label>
          ))}

          <div className="pill more-pill" onClick={() => setShowMore(!showMore)}>
            {showMore ? "Close Menu" : `See ${extraConcerns.length} More Goals`}
          </div>
        </div>

        <button className="submit-btn" onClick={handleUpdate}>
           Confirm My Skin Profile
        </button>
        {/* <p className="footer-note">You can update these details anytime from your settings.</p> */}
      </div>
    </SkinDataContainer>
  );
};

export default SkinDataForm;

// --- STYLES ---

const slideInAnimation = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SkinDataContainer = styled.main`
  background: #fffafa; 
  min-height: 100vh;
  padding: 60px 20px;
  font-family: 'Plus Jakarta Sans', sans-serif;

  .slide-in {
    animation: ${slideInAnimation} 0.8s ease-out forwards;
  }

  .skin-form-container {
    max-width: 800px;
    margin: 0 auto;      
    background: white;
    padding: 50px;
    border-radius: 35px;
    box-shadow: 0 15px 50px rgba(241, 137, 125, 0.1);
    border: 1px solid #fce8e6;
  }

  .form-header {
    text-align: center;
    margin-bottom: 40px;
  }

  h1 { font-size: 36px; color: #d16b5f; margin-bottom: 12px; font-weight: 800; letter-spacing: -0.5px; }
  .subtitle { color: #a38b88; font-size: 16px; line-height: 1.6; max-width: 600px; margin: 0 auto; }

  .hint-text {
    font-size: 14px;
    color: #f1897d;
    margin-bottom: 20px;
    font-weight: 500;
  }

  input[type="checkbox"] { display: none; }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
  }

  .card {
    border: 1.5px solid #fce8e6;
    border-radius: 20px;
    padding: 24px;
    text-align: center;
    cursor: pointer;
    background: #fff;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 700;
    color: #f1897d;
    .dot { opacity: 0; margin-right: 5px; transition: 0.3s; }
    &:hover { border-color: #f1897d; background: #fff8f7; }
  }

  input:checked + .card {
    background: #fdf0ee;
    border-color: #f1897d;
    color: #d16b5f;
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(241, 137, 125, 0.12);
    .dot { opacity: 1; }
  }

  .pills { display: flex; flex-wrap: wrap; gap: 12px; }

  .pill {
    border: 1.5px solid #fce8e6;
    padding: 14px 28px;
    border-radius: 999px;
    cursor: pointer;
    background: #fff;
    font-size: 14px;
    transition: all 0.3s ease;
    font-weight: 700;
    color: #f1897d;
    &:hover { border-color: #f1897d; background: #fff8f7; }
  }

  input:checked + .pill {
    background: #f1897d;
    border-color: #f1897d;
    color: white;
    box-shadow: 0 6px 15px rgba(241, 137, 125, 0.3);
  }

  .more-pill { 
    background: #fff5f4; 
    border: 1px dashed #f1897d; 
    color: #d16b5f; 
    &:hover { background: #fce8e6; }
  }

  .submit-btn {
    width: 100%; 
    margin-top: 50px; 
    padding: 22px; 
    border: none; 
    border-radius: 25px;
    background: #f1897d;
    color: white; 
    font-size: 18px; 
    font-weight: 800; 
    cursor: pointer;
    transition: all 0.4s ease;
    box-shadow: 0 10px 25px rgba(241, 137, 125, 0.25);
    
    &:hover { 
      background: #d16b5f;
      transform: translateY(-3px); 
      box-shadow: 0 15px 30px rgba(241, 137, 125, 0.35);
    }
  }

  .footer-note {
    text-align: center;
    margin-top: 20px;
    font-size: 13px;
    color: #a38b88;
  }
`;

const SectionTitle = styled.h2`
  font-size: 22px; 
  color: #d16b5f; 
  font-weight: 800;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  &::after {
    content: "";
    flex: 1;
    height: 1.5px;
    background: #fce8e6;
    margin-left: 20px;
  }
`;