import React from "react";
import styled from "styled-components";

const Login = () => {
  return (
    <Container>
      <FormWrapper>
        <Title>GlowUp</Title>
        <Subtitle>Login to your account</Subtitle>
        <Form>
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Button type="submit">Login</Button>
        </Form>
        <Forgot>
          Forgot your password? <Link href="/register">Reset</Link>
        </Forgot>
      </FormWrapper>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  background-color: #86A788;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const FormWrapper = styled.div`
  background-color: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  width: 350px;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 8px;
  color: #2E3A23;
`;

const Subtitle = styled.p`
  margin-bottom: 24px;
  font-size: 14px;
  color: #4F6254;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #2E3A23;
    box-shadow: 0 0 5px rgba(46, 58, 35, 0.3);
  }
`;

const Button = styled.button`
  padding: 12px;
  border-radius: 8px;
  border: none;
  background-color: #2E3A23;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;

  &:hover {
    background-color: #445134;
  }
`;

const Forgot = styled.p`
  margin-top: 16px;
  font-size: 13px;
  color: #4F6254;
`;

const Link = styled.a`
  color: #2E3A23;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

export default Login;
