import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  ChakraProvider,
} from '@chakra-ui/react';
import Api from '../Api/Api'; // Assuming Api is set up for axios requests

const DriverLogin = () => {
  const [driverName, setDriverName] = useState('');
  const [driverPassword, setDriverPassword] = useState('');
  const navigate = useNavigate();
  const toast = useToast(); // For notifications

  const handleSubmit = (e) => {
    e.preventDefault();

    const loginData = {
      username: driverName,
      password: driverPassword,
    };

    Api.post('/driver/login', loginData)
      .then((response) => {
        localStorage.setItem('Driver_bus', response.data.token); // Store the token
        toast({
          title: 'Login successful',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/driverdashboard'); // Redirect to the driver's dashboard
      })
      .catch((error) => {
        console.error('Login failed:', error);
        toast({
          title: 'Login failed',
          description: 'Invalid username or password',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
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
      <Heading mb={6} textAlign="center">
        Driver Login
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="Enter your username"
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={driverPassword}
              onChange={(e) => setDriverPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormControl>

          <Button colorScheme="blue" type="submit" width="full">
            Login
          </Button>
        </VStack>
      </form>
    </Box>
    </ChakraProvider>
  );
};

export default DriverLogin;
