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
    const isVerified = localStorage.getItem('accessToken'); // Assuming you're storing the verification status in local storage
    if (!isVerified) {
      navigate('/verify'); // Redirect to verification page if not verified
      return; // Prevent further execution
    }

    // Fetch buses if verified
    const fetchBuses = async () => {
      try {
        const response = await Api.get('/user/getAll');
        console.log('Fetched Buses:', response.data); // Log the fetched buses
        setBuses(response.data); // Store buses in state
        setFilteredBuses(response.data); // Initially, all buses are displayed
      } catch (error) {
        console.error('Error fetching buses:', error);
        // You might want to set an error state or show an error message here
      }
    };

    fetchBuses();
  }, [navigate]); // Add navigate to dependencies

// Filter buses based on the search term
useEffect(() => {
  const filtered = buses.filter((bus) =>
    (bus.busNo && bus.busNo.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (bus.location && bus.location.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (bus.time && new Date(bus.time).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase())) // Ensure bus.time is handled as a formatted date string
  );
  setFilteredBuses(filtered);
}, [searchTerm, buses]);



  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Clear token from local storage
    navigate('/userlogin'); // Redirect to login page
  };

  return (
    <ChakraProvider>
      <Box
        width="100%"
        maxWidth="800px"
        mx="auto"
        mt="10"
        p="8"
        borderRadius="md"
        boxShadow="lg"
        bg="white"
      >
        <Heading mb={6} textAlign="center">View Buses</Heading>

        {/* Logout Button */}
        <Button colorScheme="red" onClick={handleLogout} mb={4}>
          Logout
        </Button>

        {/* Search Input */}
        <Input
          placeholder="Search by bus number or route"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          mb={6}
        />

        {/* Bus List Table */}
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Bus Number</Th>
              <Th>Location</Th>
              <Th>Time</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredBuses.length > 0 ? (
              filteredBuses.map((bus) => (
                <Tr key={bus._id}>
                  <Td>{bus.busNo}</Td>
                  <Td>{bus.location}</Td>
                  <Td>{new Date(bus.time).toLocaleString()}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={3} textAlign="center">No buses found</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </ChakraProvider>
  );
};

export default ViewBus;
