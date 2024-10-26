import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  ChakraProvider,
  Text,
  Flex,
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';
import Api from '../Api/Api';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection

const AddDriver = () => {
  const [drivers, setDrivers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const [driverData, setDriverData] = useState({
    username: '',
    password: '',
    busNo: '',
    phoneNumber: '',
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('Admin_bus');
      if (!token) {
        // If no token is found, navigate to the login page
        navigate('/');
      }
    }, 1000); // Check every second (1000ms)

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [navigate]);

  
  // Fetch drivers from API on component mount
  useEffect(() => {
    Api.get('/admin/getalldriver')
      .then((response) => {
        setDrivers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching drivers:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDriverData({ ...driverData, [name]: value });
  };

  const handleAddDriver = () => {
    if (driverData.username && driverData.busNo && driverData.phoneNumber) {
      Api.post('/admin/add', driverData)
        .then((response) => {
          setDrivers([...drivers, response.data]);
          setDriverData({
            username: '',
            password: '',
            busNo: '',
            phoneNumber: '',
          });
          alert("Driver Added Successfully!..")
          setShowForm(false); // Hide the form after adding the driver
        })
        .catch((error) => {
          console.error('Error adding driver:', error);
        });
    }
  };

  const handleDeleteDriver = (id) => {
    Api.delete(`/admin/deletedriver/${id}`)
      .then(() => {
        const updatedDrivers = drivers.filter((driver) => driver._id !== id);
        alert("Delete Successfully!..")
        setDrivers(updatedDrivers);
      })
      .catch((error) => {
        console.error('Error deleting driver:', error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('Admin_bus');  // Remove token from localStorage
    navigate('/');  // Redirect to the login page
  };

  const filteredDrivers = drivers.filter((driver) =>
    driver.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ChakraProvider>
      <Box p={6} position="relative" background="#091057" color="white">
        <Flex justifyContent="space-between" mb={6}>
          <Input
            placeholder="Search Drivers"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            width="300px"
          />
          <IconButton
            icon={<AddIcon />}
            colorScheme="green"
            onClick={() => setShowForm(!showForm)}
            aria-label="Add Driver"
          />
        </Flex>

        <Button colorScheme="red" onClick={handleLogout} mb={6}>
          Logout
        </Button>

        {showForm && (
          <Box mb={6}>
            <FormControl mb={4}>
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                placeholder="Driver Username"
                value={driverData.username}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={driverData.password}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Bus Number</FormLabel>
              <Input
                name="busNo"
                placeholder="Bus Number"
                value={driverData.busNo}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                name="phoneNumber"
                placeholder="Phone Number"
                value={driverData.phoneNumber}
                onChange={handleInputChange}
              />
            </FormControl>

            <Button colorScheme="blue" onClick={handleAddDriver}>
              Add Driver
            </Button>
          </Box>
        )}

        {filteredDrivers.length > 0 ? (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Username</Th>
                <Th>Bus No</Th>
                <Th>Phone Number</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredDrivers.map((driver, index) => (
                <Tr key={driver._id}>
                  <Td>{driver.username}</Td>
                  <Td>{driver.busNo}</Td>
                  <Td>{driver.phoneNumber}</Td>
                  <Td>
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleDeleteDriver(driver._id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Text>No drivers found</Text>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default AddDriver;
