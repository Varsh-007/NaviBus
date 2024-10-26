import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, useToast, Text, Link as ChakraLink, ChakraProvider } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../Api/Api'; // Assuming Api is set up for axios requests

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email domain
    const validDomain = email.endsWith('@srmist.edu.in');
    if (!validDomain) {
      toast({
        title: 'Invalid Email',
        description: 'Please use a valid @srmist.edu.in email',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const loginData = {
      email,
      password,
    };

    // Post request for login
    try {
      const response = await Api.post('/user/login', loginData);
      const { user, accessToken } = response.data;

      // Check if the user is verified
      if (!user.isVerified) {
        localStorage.setItem('email', email); // Store email in local storage
        navigate('/verify'); // Redirect to verification page
        toast({
          title: 'Email not verified',
          description: 'Please verify your email to continue.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Store token and navigate to ViewBus page
        localStorage.setItem('accessToken', accessToken);
        toast({
          title: 'Login successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/viewbus');
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        background="linear-gradient(135deg, #0070f3 0%, #0051a2 100%)"
      >
        <Box
          width="100%"
          maxWidth="400px"
          p="8"
          borderRadius="lg"
          boxShadow="lg"
          color="white"
          bg="rgba(255, 255, 255, 0.15)"
          backdropFilter="blur(10px)"
          border="1px solid rgba(255, 255, 255, 0.2)"
        >
          <Heading mb={6} textAlign="center">User Login</Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your college email"
                  bg="rgba(255, 255, 255, 0.8)"
                  color="black"
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  bg="rgba(255, 255, 255, 0.8)"
                  color="black"
                />
              </FormControl>

              <Button colorScheme="whiteAlpha" type="submit" width="full">
                Login
              </Button>
            </VStack>
          </form>

          {/* Register and Forgot Password Links */}
          <Text mt={4} textAlign="center">
            Don't have an account?{' '}
            <ChakraLink as={Link} to="/userregister" color="whiteAlpha">
              Register here
            </ChakraLink>
          </Text>
          <Text mt={4} textAlign="center">
            <ChakraLink as={Link} to="/forgotpassword" color="white">
              Forgot Password?
            </ChakraLink>
          </Text>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default UserLogin;
