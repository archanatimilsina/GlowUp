import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(null);

  const skinTypes = [
    { id: 'normal', icon: '✨', title: 'Normal', desc: 'Well-balanced skin that is neither too oily nor too dry, with fine pores.' },
    { id: 'oily', icon: '💧', title: 'Oily', desc: 'Active sebum production that requires gentle balancing and light textures.' },
    { id: 'dry', icon: '🌵', title: 'Dry', desc: 'A thirsty complexion that craves deep hydration and barrier protection.' },
    { id: 'comb', icon: '🌿', title: 'Combination', desc: 'The dual-nature skin: seeking oil control in the T-zone and moisture elsewhere.' },
    { id: 'sens', icon: '🌸', title: 'Sensitive', desc: 'Delicate skin prone to reactivity, needing soothing botanical care.' },
  ];

  const skinTones = [
    { title: "Very Fair", color: "#F9E4D6" },
    { title: "Fair", color: "#F1CDB0" },
    { title: "Olive", color: "#E0AC82" },
    { title: "Medium Brown", color: "#A16E4B" },
    { title: "Dark", color: "#634430" },
    { title: "Deep Dark", color: "#3B2219" }
  ];

  return (
    <PageContainer>
      <div className="container">
        
        {/* --- HERO SECTION --- */}
        <HeroSection>
          <div className="hero-text">
            <Badge>OUR PHILOSOPHY</Badge>
            <h1>
              Skincare that <br />
              <em>understands</em> you.
            </h1>
            <p>
              We believe that true beauty is rooted in intelligence. 
              Your skin’s chemistry is a unique fingerprint—it’s time for a 
              ritual that honors your specific biological needs.
            </p>
            <PrimaryBtn onClick={() => navigate('/register')}>Start Your Journey</PrimaryBtn>
          </div>

          <div className="hero-img">
            <img 
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1000" 
              alt="Model with glowing skin" 
            />
            <div className="caption">Celebrating beauty in every dimension.</div>
          </div>
        </HeroSection>

        {/* --- SKIN TYPES SECTION --- */}
        <SectionHeader>
          <h2>Decoding Skin Intelligence</h2>
          <p>Every journey begins with a name. Which profile is yours?</p>
        </SectionHeader>

        <CardGrid>
          {skinTypes.map((type) => (
            <SkinCard 
              key={type.id}
              className={activeCard === type.id ? 'active' : ''}
              onClick={() => setActiveCard(type.id)}
            >
              <div className="icon">{type.icon}</div>
              <h3>{type.title}</h3>
              <p>{type.desc}</p>
            </SkinCard>
          ))}
        </CardGrid>

        {/* --- TONE SECTION --- */}
        <ToneSection>
          <div className="tone-img">
            <img 
              src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&q=80&w=1000" 
              alt="AI scanning face" 
            />
          </div>

          <div className="tone-text">
            <h2>
              Beyond the Surface:<br />
              <em>Melanin & Undertone</em>
            </h2>
            <p>
              Your complexion isn't just a color—it's a spectrum of warmth and depth. 
              Understanding your precise tone is the key to unlocking the right 
              active ingredients and color harmony.
            </p>

            <ul className="feature-list">
              <li><span>✨</span> Precise Melanin Mapping</li>
              <li><span>✨</span> Real-time Tone Detection</li>
              <li><span>✨</span> Undertone Harmony Analysis</li>
            </ul>

            <TextLink onClick={() => navigate('/faceScanPage')}>
              Try the AI Tone Scanner →
            </TextLink>
          </div>
        </ToneSection>

        {/* --- NEW SKIN TONE SPECTRUM SECTION --- */}
        <SectionHeader style={{marginTop: '120px'}}>
          <h2>The Spectrum of Tone</h2>
          <p>Our AI recognizes and celebrates the full range of human luminosity.</p>
        </SectionHeader>

        <ToneGrid>
          {skinTones.map((tone, index) => (
            <ToneBlock key={index}>
              <ColorCircle style={{ backgroundColor: tone.color }} />
              <h4>{tone.title}</h4>
            </ToneBlock>
          ))}
        </ToneGrid>

      </div>
    </PageContainer>
  );
};

export default AboutUs;

// --- STYLED COMPONENTS ---

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  background: #fffafa; /* Snowy Peach */
  min-height: 100vh;
  padding-bottom: 120px;
  font-family: 'Plus Jakarta Sans', sans-serif;

  .container {
    width: 90%;
    max-width: 1200px;
    margin: auto;
    animation: ${fadeIn} 0.8s ease-out;
  }
`;

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  padding: 80px 0;

  .hero-text h1 {
    font-size: 56px;
    font-weight: 800;
    margin: 15px 0;
    line-height: 1.1;
    color: #2d3436;
    em { color: #f1897d; font-style: italic; }
  }

  .hero-text p {
    color: #a38b88;
    max-width: 480px;
    line-height: 1.7;
    font-size: 16px;
    margin-bottom: 30px;
  }

  .hero-img {
    position: relative;
    img {
      width: 450px;
      height: 550px;
      object-fit: cover;
      border-radius: 30px;
      box-shadow: 0 30px 60px rgba(241, 137, 125, 0.15);
    }
  }

  .caption {
    position: absolute;
    bottom: 20px;
    left: -30px;
    background: #fff;
    padding: 16px 24px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    font-size: 14px;
    color: #d16b5f;
    font-weight: 700;
    border: 1px solid #fce8e6;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
    .hero-img img { width: 100%; height: 400px; }
    .caption { left: 50%; transform: translateX(-50%); }
  }
`;

const Badge = styled.div`
  display: inline-block;
  background: #fff5f4;
  color: #f1897d;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.5px;
  border: 1px solid #fce8e6;
`;

const PrimaryBtn = styled.button`
  background: #f1897d;
  color: white;
  border: none;
  padding: 16px 36px;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 10px 20px rgba(241, 137, 125, 0.2);
  &:hover { background: #d16b5f; transform: translateY(-3px); }
`;

const SectionHeader = styled.div`
  text-align: center;
  margin: 100px 0 50px;
  h2 { font-size: 36px; color: #d16b5f; font-weight: 800; margin-bottom: 10px; }
  p { color: #a38b88; font-size: 16px; }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
`;

const SkinCard = styled.div`
  background: #fff;
  border-radius: 24px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(241, 137, 125, 0.05);
  cursor: pointer;
  transition: all 0.4s ease;
  border: 2px solid transparent;

  .icon { font-size: 40px; margin-bottom: 20px; }
  h3 { color: #2d3436; margin-bottom: 15px; font-weight: 700; }
  p { font-size: 14px; color: #a38b88; line-height: 1.6; }

  &:hover { transform: translateY(-10px); border-color: #fce8e6; }
  &.active { border-color: #f1897d; background: #fffafa; }
`;

const ToneSection = styled.section`
  display: flex;
  align-items: center;
  gap: 80px;
  margin-top: 120px;
  background: #fff;
  padding: 50px;
  border-radius: 40px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.02);
  border: 1px solid #fce8e6;

  .tone-img img { width: 450px; height: 400px; object-fit: cover; border-radius: 25px; }
  .tone-text {
    h2 { font-size: 40px; font-weight: 800; color: #2d3436; line-height: 1.2; }
    em { color: #f1897d; font-style: italic; }
    p { color: #a38b88; line-height: 1.8; margin-bottom: 25px; font-size: 16px; }
  }

  .feature-list {
    list-style: none; padding: 0; margin-bottom: 30px;
    li { margin-bottom: 12px; display: flex; align-items: center; gap: 10px; font-weight: 600; color: #5d6769; span { color: #f1897d; } }
  }

  @media (max-width: 900px) { flex-direction: column-reverse; padding: 30px; text-align: center; .tone-img img { width: 100%; height: 300px; } }
`;

const TextLink = styled.span`
  color: #f1897d; font-weight: 800; font-size: 16px; cursor: pointer; transition: 0.2s;
  &:hover { color: #d16b5f; text-decoration: underline; }
`;

/* --- NEW TONE STYLES --- */

const ToneGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 30px;
  padding: 20px;
`;

const ToneBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  h4 { margin-top: 15px; color: #4A5568; font-weight: 700; font-size: 14px; }
`;

const ColorCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
  &:hover { transform: scale(1.15); }
`;