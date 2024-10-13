import React, { useState } from 'react'
import styled from 'styled-components'
import Api from '../Api/Api'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const [adminName, setAdminName] = useState('')
  const [adminPassword, setAdminPassword] = useState('')

const navigate = useNavigate();

const handleSubmit = (e) => {
  e.preventDefault();

  // Prepare the data to be sent
  const loginData = {
    username: adminName,
    password: adminPassword,
  };

  console.log(loginData);

  // Make the API call to login the admin
  Api.post('/admin/login', loginData)
    .then((response) => {
      // Store the token or data in localStorage
      localStorage.setItem("Admin_bus", response.data.token); // Assuming response.data contains a token

      // Navigate to the /adddriver route after login
      navigate('/adddriver');

      // Log success response
      console.log('Login successful:', response.data);
    })
    .catch((error) => {
      // Handle error
      console.error('Login failed:', error);
    });
};


  return (
    <Container>
      <LoginBox>
        <Title>Admin Login</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Username"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
          />
          <Button type="submit">Login</Button>
        </form>
      </LoginBox>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`

const LoginBox = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  width: 300px;
`

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  text-align: center;
  margin-bottom: 1.5rem;
`

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
`

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`

export default AdminLogin
