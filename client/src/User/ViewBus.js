import React, { useEffect, useState } from 'react';
import {
  Box,
  Input,
  Heading,
  Table,
  Tbody,
  Tr,
  Td,
  Th,
  Thead,
  ChakraProvider,
  Button,
  
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

import Api from '../Api/Api'; // Assuming Api is set up for axios requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const ViewBus = () => {
  const [buses, setBuses] = useState([]); // To store all buses
  const [filteredBuses, setFilteredBuses] = useState([]); // To store filtered buses based on search
  const [searchTerm, setSearchTerm] = useState(''); // Search term input
  const navigate = useNavigate(); // Initialize navigate for redirection

  // Fetch all buses from the API on component mount
  useEffect(() => {
    // Check if user is verified
    const isVerified = localStorage.getItem('accessToken');
    if (!isVerified) {
      navigate('/verify');
      return;
    }

    const fetchBuses = async () => {
      try {
        const response = await Api.get('/user/getAll');
        console.log('Fetched Buses:', response.data);
        setBuses(response.data);
        setFilteredBuses(response.data);
      } catch (error) {
        console.error('Error fetching buses:', error);
      }
    };

    fetchBuses();
  }, [navigate]);

  // Filter buses based on the search term
  useEffect(() => {
    const filtered = buses.filter((bus) =>
      (bus.busNo && bus.busNo.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (bus.location && bus.location.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (bus.time && new Date(bus.time).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredBuses(filtered);
  }, [searchTerm, buses]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/userlogin');
  };

  // Define glass effect and animation
  const glassEffect = {
    backdropFilter: 'blur(10px)',
    bgColor: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  };

  const fadeIn = keyframes`
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  `;

  const slideIn = keyframes`
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  `;

  return (
    <ChakraProvider>
      <Box
        width="100%"
        minHeight="100vh"
        bgGradient="linear(to-br, blue.500, blue.700)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={6}
      >
        <Box
          maxWidth="800px"
          width="100%"
          borderRadius="md"
          boxShadow="xl"
          p={8}
          animation={`${fadeIn} 0.8s ease-in-out`}
          sx={glassEffect}
        >
          <Heading mb={6} textAlign="center" color="white">
            View Buses
          </Heading>

          {/* Logout Button */}
          <Button colorScheme="red" onClick={handleLogout} mb={4} animation={`${slideIn} 0.5s ease-in-out`}>
            Logout
          </Button>

          {/* Search Input */}
          <Input
            placeholder="Search by bus number or route"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb={6}
            bg="rgba(255, 255, 255, 0.2)"
            color="white"
            _placeholder={{ color: 'whiteAlpha.800' }}
            border="none"
            animation={`${slideIn} 0.6s ease-in-out`}
          />

          {/* Bus List Table */}
          <Table variant="simple" colorScheme="whiteAlpha" animation={`${slideIn} 0.7s ease-in-out`}>
            <Thead>
              <Tr>
                <Th color="white">Bus Number</Th>
                <Th color="white">Location</Th>
                <Th color="white">Time</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredBuses.length > 0 ? (
                filteredBuses.map((bus) => (
                  <Tr key={bus._id} _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }} animation={`${slideIn} 0.8s ease-in-out`}>
                    <Td color="white">{bus.busNo}</Td>
                    <Td color="white">{bus.location}</Td>
                    <Td color="white">{new Date(bus.time).toLocaleString()}</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={3} textAlign="center" color="white">No buses found</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default ViewBus;
