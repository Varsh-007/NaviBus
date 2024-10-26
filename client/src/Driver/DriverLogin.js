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
  Flex,
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
      <Flex
        align="center"
        justify="center"
        minH="100vh"
        background="linear-gradient(135deg, #0070f3 0%, #0051a2 100%)"
        color="black"
      >
        <Box
          width="100%"
          maxWidth="400px"
          p="8"
          borderRadius="md"
          boxShadow="lg"
          bg="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(10px)" // Glass effect
          border="1px solid rgba(255, 255, 255, 0.3)"
        >
          <Heading mb={6} textAlign="center" color="white">
            Driver Login
          </Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="username" isRequired>
                <FormLabel color="white">Username</FormLabel>
                <Input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Enter your username"
                  bg="whiteAlpha.800"
                  _placeholder={{ color: 'gray.500' }}
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel color="white">Password</FormLabel>
                <Input
                  type="password"
                  value={driverPassword}
                  onChange={(e) => setDriverPassword(e.target.value)}
                  placeholder="Enter your password"
                  bg="whiteAlpha.800"
                  _placeholder={{ color: 'gray.500' }}
                />
              </FormControl>

              <Button colorScheme="whiteAlpha" type="submit" width="full">
                Login
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default DriverLogin;
