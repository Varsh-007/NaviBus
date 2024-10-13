import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, useToast, ChakraProvider } from '@chakra-ui/react';
import Api from '../Api/Api'; // Assuming Api is set up for axios requests
import { useNavigate } from 'react-router-dom';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  // Function to handle OTP generation and sending
  const generateAndSendOtp = async () => {
    const email = localStorage.getItem('email'); // Retrieve email from local storage
  console.log(email)
    try {
      await Api.post('/user/generate-otp', { email }); // Call API to generate and send OTP
      toast({
        title: 'OTP sent',
        description: 'An OTP has been sent to your email for verification.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error generating OTP:', error);
      toast({
        title: 'Failed to send OTP',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem('email'); // Retrieve email from local storage

    const otpData = {
      email,
      otp,
    };

    try {
      const response = await Api.post('/user/verify-otp', otpData);
      toast({
        title: 'OTP verified successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/userlogin'); // Redirect to ViewBus page after verification
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast({
        title: 'Verification failed',
        description: 'Invalid OTP or it has expired',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Generate OTP when component mounts
  React.useEffect(() => {
    generateAndSendOtp();
  }, []);

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
        <Heading mb={6} textAlign="center">Verify OTP</Heading>
        <form onSubmit={handleVerify}>
          <VStack spacing={4}>
            <FormControl id="otp" isRequired>
              <FormLabel>Enter OTP</FormLabel>
              <Input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the OTP sent to your email"
              />
            </FormControl>

            <Button colorScheme="blue" type="submit" width="full">
              Verify OTP
            </Button>
          </VStack>
        </form>
      </Box>
    </ChakraProvider>
  );
};

export default VerifyOtp;
