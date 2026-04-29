import React, { useState } from 'react';
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom"; 
import { FaUserCircle } from 'react-icons/fa'; 
import RlButton from './elementComponent/Button/Button'; 
import useUserStore from '../store/useUserStore';

const Navbar = () => {
  const location = useLocation(); 
  
  const [loginStatus] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  
  const { profilePic } = useUserStore();

  const showLink = (path) => location.pathname !== path;

  return (
    <NavBarContainer>
      <ul>
        {showLink("/") && <li><Link to="/">Home</Link></li>}

        {showLink("/product") && <li><Link to="/product">Product</Link></li>}

        {showLink("/forum/disscussionForum") && (
            <li><Link to="/forum/disscussionForum">Forum</Link></li>
        )}

        {showLink("/cartPage") && (
            <li><Link to="/cartPage">Cart</Link></li>
        )}

        {showLink("/AboutUs") && <li><Link to="/AboutUs">About Us</Link></li>}

        {!loginStatus ? (
          <AuthButtons>
            <RlButton name="LogIn" link="/login" />
            <RlButton name="Register" link="/register" />
          </AuthButtons>
        ) : (
          <ProfileLink to="/profile">
            <AvatarWrapper>
              {profilePic ? (
                <UserImg src={profilePic} alt="Profile" />
              ) : (
                <FaUserCircle size={42} color="#4A4A4A" />
              )}
            </AvatarWrapper>
          </ProfileLink>
        )}
      </ul>
    </NavBarContainer>
  );
};

export default Navbar;



const NavBarContainer = styled.nav`
  height: 80px;
  width: 90%;
  margin: 20px auto;
  display: flex;
  align-items: center;
  justify-content: flex-end; 
  padding: 0 30px;

  ul {
    display: flex;
    list-style: none;
    gap: 25px;
    align-items: center;
    margin: 0;
    padding: 0;
  }

  ul li a {
    font-weight: 600;
    text-decoration: none;
    color: #333;
    font-size: 15px;
    transition: 0.3s ease;
    
    &:hover { 
      color: #f1897d; 
      transform: translateY(-1px);
    }
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 12px;
  
  a {
    text-decoration: none;
  }
`;

const ProfileLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.08);
  }
`;

const UserImg = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%; 
  object-fit: cover;  
  border: 2px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #f0f0f0;
`;