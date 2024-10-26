import React, { useState } from 'react';
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
import { keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api/Api';

const DriverLocation = () => {
  const [busNo, setBusNo] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const locationData = {
      busNo: busNo.toLowerCase(),
      location: location.toLowerCase(),
      time,
    };

    Api.post('/driver/location', locationData)
      .then((response) => {
        setBusNo('');
        setLocation('');
        setTime('');
        toast({
          title: 'Location updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        console.error('Error updating location:', error);
        toast({
          title: 'Error updating location',
          description: 'Please try again',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleLogout = () => {
    localStorage.clear();
    toast({
      title: 'Logout successful',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/');
  };

  // Animation for smooth entry
  const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  `;

  return (
    <ChakraProvider>
      <Flex
        align="center"
        justify="center"
        minH="100vh"
        background="linear-gradient(135deg, #0070f3 0%, #0051a2 100%)"
        color="black"
        padding="4"
      >
        <Box
          width="100%"
          maxWidth="400px"
          p="8"
          borderRadius="md"
          boxShadow="lg"
          bg="rgba(255, 255, 255, 0.1)"
          backdropFilter="blur(10px)"
          border="1px solid rgba(255, 255, 255, 0.3)"
          animation={`${fadeIn} 0.8s ease-out`} // Applying animation
        >
          <Heading mb={6} textAlign="center" color="white">
            Update Location
          </Heading>

          <Button colorScheme="red" onClick={handleLogout} mb={4}>
            Logout
          </Button>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="busNo" isRequired>
                <FormLabel color="white">Bus Number</FormLabel>
                <Input
                  type="text"
                  value={busNo}
                  onChange={(e) => setBusNo(e.target.value.toLowerCase())}
                  placeholder="Enter your bus number"
                  bg="whiteAlpha.800"
                  _placeholder={{ color: 'gray.500' }}
                />
              </FormControl>

              <FormControl id="location" isRequired>
                <FormLabel color="white">Location</FormLabel>
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value.toLowerCase())}
                  placeholder="Enter Location"
                  bg="whiteAlpha.800"
                  _placeholder={{ color: 'gray.500' }}
                />
              </FormControl>

              <FormControl id="time" isRequired>
                <FormLabel color="white">Time</FormLabel>
                <Input
                  type="datetime-local"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  bg="whiteAlpha.800"
                  _placeholder={{ color: 'gray.500' }}
                />
              </FormControl>

              <Button colorScheme="blue" type="submit" width="full">
                Update Location
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default DriverLocation;
