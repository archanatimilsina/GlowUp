import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { FiEdit2, FiChevronRight } from "react-icons/fi";
import { MdOutlineMedicalServices } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa"; 
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";

const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // We pull everything from the store
  const { 
    email, 
    profilePic, 
    skinTone,    
    skinType,    
    skinConcerns, 
    setUserData,
    logout
  } = useUserStore();

  // --- SYNC WITH DATABASE ON COMPONENT MOUNT ---
  useEffect(() => {
    const fetchLatestData = async () => {
      // If no email, we can't fetch.
      if (!email) return;

      try {
        console.log("Fetching latest data for:", email);
        const response = await fetch(`http://127.0.0.1:8000/api/get-profile/?email=${email}`);
        const data = await response.json();

        if (response.ok) {
          console.log("Database Response:", data);
          
          setUserData({
            skinTone: data.skin_tone,    // database: skin_tone -> store: skinTone
            skinType: data.skin_type,    // database: skin_type -> store: skinType
            skinConcerns: data.skin_concerns, // database: skin_concerns -> store: skinConcerns
            profilePic: data.profile_pic || profilePic
          });
        }
      } catch (error) {
        console.error("Error syncing with database:", error);
      }
    };

    fetchLatestData();
  }, [email, setUserData]); 

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file); 
    formData.append("email", email); 

    try {
      const response = await fetch("http://127.0.0.1:8000/api/upload-profile-pic/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.image_url) {
        setUserData({ profilePic: data.image_url });
        alert("Success! Profile picture updated.");
      } else {
        alert(data.error || "Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <SkinDataform>
      <Card>
        <Profile>
          <Avatar>
            {profilePic ? (
              <img src={profilePic} alt="profile" />
            ) : (
              <FaUserCircle size={110} color="#E0F2F1" />
            )}

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept="image/*"
            />

            <EditBtn onClick={handleEditClick}>
              <FiEdit2 size={12} /> Edit
            </EditBtn>
          </Avatar>

          <p className="email-text">{email}</p>
        </Profile>

        <Grid>
          <InfoCard>
            <span>Your Skin Tone</span>
            <strong>{skinTone || "Not Set"}</strong>
          </InfoCard>

          <InfoCard>
            <span>Your Skin Type</span>
            <strong>{skinType || "Not Set"}</strong>
          </InfoCard>
        </Grid>

        <ConcernCard>
          <div>
            <span>Primary Skin Concerns</span><br />
            {/* We use a span here to ensure long text wraps correctly */}
            <p className="concerns-list">
                {skinConcerns || "No concerns listed yet"}
            </p>
          </div>
          <PulseIcon />
        </ConcernCard>

        <FormRow onClick={() => navigate("/datafillUp")}>
          <div className="left">
            <MdOutlineMedicalServices />
            <div>
              <h5>Skin Details Form</h5>
              <p>Click here to update your skin info</p>
            </div>
          </div>
          <FiChevronRight />
        </FormRow>

        <Divider>And</Divider>

        <CTA onClick={() => navigate("/faceScanPage")}>Start AI Face Analysis</CTA>

        <SignOut onClick={handleSignOut}>Sign Out</SignOut>
      </Card>
    </SkinDataform>
  );
};

export default ProfilePage;

// --- STYLED COMPONENTS ---

const SkinDataform = styled.main`
  min-height: 90vh;
  display: grid;
  place-items: center;
  padding: 20px;
  background: #fdfdfd;
`;

const Card = styled.section`
  width: 100%;
  max-width: 380px;
  background: #fff;
  border-radius: 32px;
  padding: 30px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
`;

const Profile = styled.div`
  text-align: center;
  .email-text { margin-top: 12px; font-size: 14px; color: #64748b; font-weight: 500; }
`;

const Avatar = styled.div`
  position: relative;
  width: 120px;
  margin: auto;
  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #F1F5F9;
  }
`;

const EditBtn = styled.button`
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: #f76454;
  color: #fff;
  border: 2px solid #fff;
  padding: 6px 12px;
  font-size: 11px;
  border-radius: 20px;
  display: flex; gap: 4px; align-items: center;
  cursor: pointer;
  &:hover { background: #6A9C89; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 24px;
`;

const InfoCard = styled.div`
  background: #F8FAFC;
  border-radius: 20px;
  padding: 16px;
  span { font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 700; }
  strong { display: block; margin-top: 4px; font-size: 15px; color: #1e293b; }
`;

const ConcernCard = styled.div`
  margin-top: 16px;
  padding: 20px;
  border-radius: 20px;
  background: #F8FAFC;
  display: flex; justify-content: space-between; align-items: center;
  span { font-size: 10px; text-transform: uppercase; color: #94a3b8; font-weight: 700; }
  .concerns-list { 
    margin: 4px 0 0 0; 
    font-size: 14px; 
    color: #1e293b; 
    font-weight: 600;
    line-height: 1.4;
  }
`;

const PulseIcon = styled.div`
  min-width: 12px; height: 12px; border-radius: 50%; background: #f76454;
  box-shadow: 0 0 0 4px rgba(106, 156, 137, 0.2);
`;

const FormRow = styled.div`
  margin-top: 20px; padding: 18px; border-radius: 20px; background: white; border: 1.5px solid #F1F5F9;
  display: flex; align-items: center; justify-content: space-between; cursor: pointer;
  &:hover { border-color: #f76454; }
  .left { display: flex; gap: 14px; align-items: center; svg { font-size: 24px; color: #f76454; } }
  h5 { margin: 0; font-size: 15px; }
  p { font-size: 12px; color: #f76454; margin: 0; }
`;

const Divider = styled.div`
  text-align: center; margin: 25px 0; font-size: 12px; font-weight: 700; color: #cbd5e1; position: relative;
  &::before, &::after { content: ""; position: absolute; top: 50%; width: 35%; height: 1px; background: #f1f5f9; }
  &::before { left: 0; } &::after { right: 0; }
`;

const CTA = styled.button`
  width: 100%; padding: 18px; border-radius: 20px; border: none; background: #f76454; color: #fff;
  font-size: 16px; cursor: pointer; font-weight: 700;
  &:hover { background: #0c2b27; }
`;

const SignOut = styled.p`
  margin-top: 20px; text-align: center; font-size: 14px; color: #ef4444; cursor: pointer; font-weight: 700;
  &:hover { text-decoration: underline; }
`;