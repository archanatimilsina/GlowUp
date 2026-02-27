import React, { useState } from "react";
import styled from "styled-components";
import useFetch from '../hooks/useFetch';
import { useNavigate } from "react-router-dom";

const Register = () => {
  const url = "http://127.0.0.1:8000/api/register/";
  const { loading, fetchData } = useFetch(url);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: ""
  });

  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage(null);
    setSuccessMessage(null);

    if (formData.password !== formData.confirm_password) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const options = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password
        })
      };

      const result = await fetchData(options);

      if (result.message) {
        setSuccessMessage("Registration successful!");
        setFormData({
          first_name: "",
          last_name: "",
          username: "",
          email: "",
          password: "",
          confirm_password: ""
        });
        // Wait a second before navigating so they can see the success message
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setErrorMessage(result.error || "Registration failed.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong.");
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>GlowUp</Title>
        <Subtitle>Register to get started</Subtitle>

        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        {successMessage && <SuccessText>{successMessage}</SuccessText>}

        <Form onSubmit={handleSubmit}>
          {/* <InputGroup>
            <Input
              type="text"
              placeholder="First Name"
              name="first_name"
              onChange={handleChange}
              value={formData.first_name}
              required
            />
            <Input
              type="text"
              placeholder="Last Name"
              name="last_name"
              onChange={handleChange}
              value={formData.last_name}
              required
            />
          </InputGroup> */}
          
          <Input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange}
            value={formData.username}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            value={formData.email}
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
          <Input
            type="password"
            placeholder="Confirm Password"
            name="confirm_password"
            onChange={handleChange}
            value={formData.confirm_password}
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </Button>
        </Form>

        <FooterText>
          Already have an account? <StyledLink onClick={() => navigate('/login')}>Login</StyledLink>
        </FooterText>
      </FormWrapper>
    </Container>
  );
};

// --- STYLES ---

const Container = styled.div`
  background-color: #fffafa; /* Snowy Peach background */
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 20px;
`;

const FormWrapper = styled.div`
  background-color: #fff;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(241, 137, 125, 0.1);
  width: 100%;
  max-width: 450px;
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

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  @media (max-width: 400px) {
    flex-direction: column;
    gap: 0;
  }
`;

const Input = styled.input`
  padding: 14px 18px;
  margin-bottom: 16px;
  border-radius: 12px;
  border: 1.5px solid #fce8e6;
  background: #fffafa;
  font-size: 14px;
  outline: none;
  width: 100%;
  box-sizing: border-box;
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
  margin-top: 10px;
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

const FooterText = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: #a38b88;
`;

const StyledLink = styled.span`
  color: #f1897d;
  text-decoration: none;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s;

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
  border: 1px solid #e8f5e9;
`;

export default Register;