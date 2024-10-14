import React from 'react';
import { Box, Button, Image, HStack, VStack, Text } from '@chakra-ui/react';
import { IoPersonCircle, IoCarSport, IoLockClosed } from 'react-icons/io5'; // Importing icons from react-icons
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import Background from './Assets/background.jpg'; // Background image
import logo from './Assets/Logo.jpg'
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Home = () => {
  return (
    <Container>
      <NavBar>
        <LogoImage src={logo} alt="Logo"/>
        <NavLinks>
          <LinkButton as={Link} to="/adminlogin" leftIcon={<IoLockClosed />} colorScheme="blue">
            Admin Login
          </LinkButton>
          <LinkButton as={Link} to="/userlogin" leftIcon={<IoPersonCircle />} colorScheme="green">
            User Login
          </LinkButton>
          <LinkButton as={Link} to="/driverlogin" leftIcon={<IoCarSport />} colorScheme="teal">
            Driver Login
          </LinkButton>
        </NavLinks>
      </NavBar>
      <WelcomeMessage>
        <AnimatedText>Welcome to the Portal</AnimatedText>
        <SloganText>Your gateway to seamless transport management!</SloganText>
      </WelcomeMessage>
    </Container>
  );
};

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url(${Background}); // Use the background image
  background-size: cover; // Ensure the background covers the entire page
  background-position: center; // Center the background image
  animation: ${fadeIn} 1s ease-in-out; // Fade-in animation
  position: relative; // For positioning child elements
`;

const NavBar = styled(HStack)`
  width: 100%;
  height: 50px;
  padding: 0.5rem; // Reduced padding for smaller size
  background-color: rgba(255, 255, 255, 0.9); // Semi-transparent background
  position: absolute; // Fixed at the top
  top: 0;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease; // Smooth transition effect
  &:hover {
    background-color: rgba(255, 255, 255, 0.5); // Change to transparent on hover
  }
`;

const LogoImage = styled(Image)`
  height: 65px; // Adjust height for smaller size
  
  padding: 10px; // Adjust padding for smaller size
  border-radius:50%;
`;

const NavLinks = styled(HStack)`
  spacing: 24px; // Spacing between links
`;

const WelcomeMessage = styled(VStack)`
  margin-top: 100px; // Move it down below the nav bar
  text-align: left; // Left align text
  width: 100%; // Make it fit to the page
`;

const AnimatedText = styled(Text)`
  font-size: 3rem; // Increase the size for the main slogan
  color: black; // Black text color for better contrast
  animation: ${fadeIn} 1s ease-in-out; // Fade-in animation
  text-align: left; // Left align the text
  margin-bottom: 0.5rem; // Space below the slogan
`;

const SloganText = styled(Text)`
  font-size: 1.5rem; // Size for the additional slogan
  color: black; // Black text color
  text-align: left; // Left align the text
`;

const LinkButton = styled(Button)`
  text-decoration: none; // Remove underline from links
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1.2rem;
  transition: background-color 0.3s ease;

  &:hover {
    transform: scale(1.05); // Slight zoom effect on hover
      }

  color: black; // Set text color for links
`;

export default Home;
