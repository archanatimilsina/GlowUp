import React, { useState } from "react";
import styled from "styled-components";
import useFetch from '../hooks/useFetch';
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useUserStore";

const Login = () => {
  const url = "http://127.0.0.1:8000/api/login/";
  const { loading, fetchData } = useFetch(url);
  const [formData, setFormData] = useState({
    'emailOrUsername': "",
    "password": "",
  });
  
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const setUserData = useUserStore((state) => state.setUserData);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null); // Clear previous errors
    
    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailOrUsername: formData.emailOrUsername,
        password: formData.password
      })
    };

    const result = await fetchData(options);

    if (result.message) {
      setSuccessMessage(result.message);
      
      const userData = result.data; // This is the data coming from your Django backend
      
      // Prepare the data to sync with your Zustand store
      // We map the backend names (underscore) to your store names (camelCase)
      const dataToStore = {
        email: userData.email,
        username: userData.username,
        isLoggedIn: true,
        // Sync Skin Data immediately
        skin_tone: userData.skin_tone,
        skinTone: userData.skin_tone,
        skin_type: userData.skin_type,
        skinType: userData.skin_type,
        skin_concerns: userData.skin_concerns,
        skinConcerns: userData.skin_concerns,
      };

      // Handle Profile Picture URL
      if (userData.profilePic) {
        dataToStore.profilePic = `http://127.0.0.1:8000${userData.profilePic}`;
      }

      // Save everything to Store and LocalStorage
      setUserData(dataToStore);
      localStorage.setItem("isLoggedIn", "true");

      navigate('/');
    } else {
      setErrorMessage(result.error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>GlowUp</Title>
        <Subtitle>Login to your account</Subtitle>
        
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        {successMessage && <SuccessText>{successMessage}</SuccessText>}
        
        <Form onSubmit={handleSubmit}>
          <Input 
            type="text" 
            placeholder="Email or username" 
            name="emailOrUsername" 
            onChange={handleChange} 
            value={formData.emailOrUsername}
            required
          />
          <Input 
            type="password" 
            placeholder="Password" 
            name="password" 
            onChange={handleChange} 
            value={formData.password}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
        
        <Forgot>
          Don't have an account? <Link onClick={() => navigate("/register")}>Register</Link>
        </Forgot>
        {/* <Forgot>
          Forgot Password? <Link href="#">Click here</Link>
        </Forgot> */}
      </FormWrapper>
    </Container>
  );
};

// --- STYLES (Snowy Peach Theme) ---

const Container = styled.div`
  background-color: #fffafa; /* Snowy Peach background */
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const FormWrapper = styled.div`
  background-color: #fff;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(241, 137, 125, 0.1);
  width: 380px;
  text-align: center;
  border: 1px solid #fce8e6;
`;

const Title = styled.h2`
  margin-bottom: 8px;
  color: #d16b5f; /* Deep Peach */
  font-size: 32px;
  font-weight: 800;
`;

const Subtitle = styled.p`
  margin-bottom: 30px;
  font-size: 15px;
  color: #a38b88;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 14px 18px;
  margin-bottom: 18px;
  border-radius: 12px;
  border: 1.5px solid #fce8e6;
  background: #fffafa;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #f1897d;
    background: white;
    box-shadow: 0 0 8px rgba(241, 137, 125, 0.2);
  }
`;

const Button = styled.button`
  padding: 15px;
  border-radius: 12px;
  border: none;
  background-color: #f1897d; /* Main Peach Color */
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(241, 137, 125, 0.2);

  &:hover {
    background-color: #d16b5f;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(241, 137, 125, 0.3);
  }

  &:disabled {
    background-color: #fce8e6;
    cursor: not-allowed;
  }
`;

const Forgot = styled.p`
  margin-top: 18px;
  font-size: 14px;
  color: #a38b88;
`;

const Link = styled.span`
  color: #f1897d;
  text-decoration: none;
  font-weight: 700;
  cursor: pointer;
  margin-left: 5px;

  &:hover {
    text-decoration: underline;
    color: #d16b5f;
  }
`;

const ErrorText = styled.p`
  color: #d16b5f;
  background: #fff5f4;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 13px;
  border: 1px solid #fce8e6;
`;

const SuccessText = styled.p`
  color: #388e3c;
  background: #f1f8f1;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 13px;
`;

export default Login;