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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import Api from '../Api/Api'; // Assuming Api is set up for axios requests

const DriverLocation = () => {
  const [busNo, setBusNo] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const toast = useToast();
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Convert busNo and location values to lowercase
    const locationData = {
      busNo: busNo.toLowerCase(),
      location: location.toLowerCase(),
      time,
    };
  
    Api.post('/driver/location', locationData)
      .then((response) => {
        // Reset form fields after successful submission
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

  // Logout function to clear localStorage and redirect
  const handleLogout = () => {
    localStorage.clear(); // Clear all items from localStorage
    toast({
      title: 'Logout successful',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/'); // Redirect to login page
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
          Update Location
        </Heading>

        {/* Logout Button */}
        <Button colorScheme="red" onClick={handleLogout} mb={4}>
          Logout
        </Button>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="busNo" isRequired>
              <FormLabel>Bus Number</FormLabel>
              <Input
                type="text"
                value={busNo}
                onChange={(e) => setBusNo(e.target.value.toLowerCase())} // Convert input to lowercase
                placeholder="Enter your bus number"
              />
            </FormControl>

            <FormControl id="location" isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value.toLowerCase())} // Convert input to lowercase
                placeholder="Enter Location"
              />
            </FormControl>

            <FormControl id="time" isRequired>
              <FormLabel>Time</FormLabel>
              <Input
                type="datetime-local"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </FormControl>

            <Button colorScheme="blue" type="submit" width="full">
              Update Location
            </Button>
          </VStack>
        </form>
      </Box>
    </ChakraProvider>
  );
};

export default DriverLocation;
