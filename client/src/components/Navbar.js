// src/components/Navbar.js
import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const NavBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 120;
  backdrop-filter: blur(8px) saturate(120%);
  background: rgba(255,255,255,0.04);
  border-bottom: 1px solid rgba(255,255,255,0.03);
  box-shadow: 0 4px 18px rgba(2,6,23,0.12);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 20px;
  display:flex;
  align-items:center;
  justify-content:space-between;
`;

const Brand = styled.div`
  font-weight: 800;
  color: ${({theme}) => theme.colors.primary};
  font-size: 1.6rem;
`;

const NavList = styled.nav`
  display:flex;
  align-items:center;
  gap: 20px;
`;

const StyledLink = styled(NavLink)`
  position: relative;
  padding: 8px 12px;
  color: ${({theme}) => theme.colors.text.secondary};
  font-weight: 700;
  border-radius: 8px;

  &.active {
    color: ${({theme}) => theme.colors.primary};
  }

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -10px;
    height: 3px;
    width: 0;
    background: ${({theme}) => theme.ui.accent};
    border-radius: 999px;
    box-shadow: 0 6px 18px rgba(37,99,235,0.12);
    transition: width 220ms ease;
  }

  &.active::after { width: 56px; }
  &:hover { background: rgba(255,255,255,0.02); color: ${({theme}) => theme.colors.text.primary}; }
`;

const Navbar = () => {
  return (
    <NavBar>
      <Container>
        <Brand>Droplet</Brand>
        <NavList>
          <StyledLink to="/" end>Dashboard</StyledLink>
          <StyledLink to="/history">History</StyledLink>
          <StyledLink to="/about">About</StyledLink>
        </NavList>
      </Container>
    </NavBar>
  );
};

export default Navbar;
