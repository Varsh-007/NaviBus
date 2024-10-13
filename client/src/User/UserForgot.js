import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, useToast, Text, HStack, ChakraProvider } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Api from '../Api/Api'; // Assuming Api is set up for axios requests

const UserForgot = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(Array(4).fill('')); // Adjust length based on OTP format
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('request'); // 'request', 'verify'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to next input
      if (value.length === 1 && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      } else if (value.length === 0 && index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Api.post('/user/reset-password', { email });
      if (response.status === 200) {
        setSuccess('Password reset code has been sent to your email.');
        setStep('verify');
      } else {
        setError(response.data.message || 'Failed to send reset link.');
      }
    } catch (error) {
      console.error('Error during password reset request:', error);
      setError('An error occurred while sending the reset link.');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await Api.patch('/user/resetpass-otp', { token: otpCode, pwd: newPassword });
      if (response.status === 200) {
        setSuccess('Password reset successfully!');
        navigate('/userlogin');
        setStep('request'); // Go back to initial state
        setEmail('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(response.data?.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error during OTP verification and password reset:', error);
      setError(error.response?.data?.message || 'An error occurred during OTP verification and password reset');
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
        {step === 'request' && (
          <VStack spacing={4} as="form" onSubmit={handleRequestSubmit}>
            <Heading mb={6} textAlign="center">Forgot Password</Heading>
            {error && <Text color="red.500">{error}</Text>}
            {success && <Text color="green.500">{success}</Text>}
            <FormControl id="email" isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">Send Reset Code</Button>
          </VStack>
        )}

        {step === 'verify' && (
          <VStack spacing={4} as="form" onSubmit={handleOtpSubmit}>
            <Heading mb={6} textAlign="center">Reset Password</Heading>
            {error && <Text color="red.500">{error}</Text>}
            {success && <Text color="green.500">{success}</Text>}
            <HStack spacing={2}>
              {otp.map((value, index) => (
                <Input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={value}
                  onChange={(e) => handleOtpChange(e, index)}
                  placeholder="0"
                  width="50px"
                  textAlign="center"
                />
              ))}
            </HStack>
            <FormControl id="newPassword" isRequired>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
              />
            </FormControl>
            <FormControl id="confirmPassword" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">Reset Password</Button>
          </VStack>
        )}
      </Box>
    </ChakraProvider>
  );
};

export default UserForgot;
