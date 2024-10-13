import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, useToast, ChakraProvider } from '@chakra-ui/react';
import Api from '../Api/Api'; // Assuming Api is set up for axios requests
import { useNavigate } from 'react-router-dom';

const UserRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    // Validate password confirmation
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const registrationData = {
      email,
      password,
    };

    try {
      // Post request for registration
      await Api.post('/user/register', registrationData);
      toast({
        title: 'Registration successful',
        description: 'Please verify your email.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      localStorage.setItem('email', email); // Store email in local storage for OTP verification
      navigate('/verify'); // Navigate to verification page
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: 'Registration failed',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider>
      <Box
        width="100%"
        maxWidth="400px"
        mx="auto"
        mt="10"
        p="8"
        borderRadius="md"
        boxShadow="lg"
        bg="white"
      >
        <Heading mb={6} textAlign="center">User Registration</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your college email"
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </FormControl>

            <FormControl id="confirmPassword" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </FormControl>

            <Button colorScheme="blue" type="submit" width="full">
              Register
            </Button>
          </VStack>
        </form>
      </Box>
    </ChakraProvider>
  );
};

export default UserRegister;
