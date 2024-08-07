import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('Es');
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    closeMenu();
  };

  return (
    <Nav>
      <Hamburger onClick={toggleMenu}>
        <span />
        <span />
        <span />
      </Hamburger>
      <Menu isOpen={isOpen}>
        <MenuLink to="/" isActive={location.pathname === '/'} onClick={closeMenu}>Inicio</MenuLink>
        <MenuLink to="/explorarmapa" isActive={location.pathname === '/explorarmapa'} onClick={closeMenu}>Explorar Mapa</MenuLink>
        <MenuLink to="/buscarrecetas" isActive={location.pathname === '/buscarrecetas'} onClick={closeMenu}>Buscar Recetas</MenuLink>
        <LanguageSelector>
          <LanguageOption 
            selected={language === 'Es'} 
            onClick={() => handleLanguageChange('Es')}
          >
            Es
          </LanguageOption>
          <LanguageOption 
            selected={language === 'En'} 
            onClick={() => handleLanguageChange('En')}
          >
            En
          </LanguageOption>
        </LanguageSelector>
      </Menu>
      <LoginIcon href="/login">
        <img src="https://www.pngkit.com/png/full/940-9406687_already-a-proact-user-employee-icon-white-png.png" alt="Login Icon" />
      </LoginIcon>
    </Nav>
  );
};

export default Navbar;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background: #333;
  color: white;
  padding: 0 20px;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-sizing: border-box;
  left: 0; /* Asegura que el navbar no tenga margen izquierdo */
`;

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;

  span {
    height: 3px;
    width: 25px;
    background: white;
    margin-bottom: 4px;
    border-radius: 5px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Menu = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    flex-direction: column;
    width: 100%;
    background: #333;
    position: absolute;
    top: 60px;
    left: 0;
    padding: 10px 0;
    z-index: 9999;
  }
`;

const MenuLink = styled(Link)`
  text-decoration: none;
  color: ${({ isActive }) => (isActive ? '#f0a500' : 'white')};
  font-size: 1.2rem;

  &:hover {
    color: #f0a500;
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    width: 100%;
    text-align: center;
  }
`;

const LoginIcon = styled.a`
  display: flex;
  align-items: center;
  img {
    height: 30px;
    width: 30px;
  }
`;

const LanguageSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
  }
`;

const LanguageOption = styled.span`
  cursor: ${({ selected }) => (selected ? 'default' : 'pointer')};
  font-size: 1.2rem;
  color: ${({ selected }) => (selected ? '#f0a500' : 'white')};

  &:hover {
    color: ${({ selected }) => (selected ? '#f0a500' : '#f0a500')};
  }
`;

