import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import LoginAuth from './LoginAuth'; 
import { useTranslation } from 'react-i18next';
const Navbar = () => {
  const { i18n } = useTranslation("global");
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('En');
  const [showUserAuth, setShowUserAuth] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang.toLowerCase());
    closeMenu();
  };

  const toggleUserAuth = () => {
    setShowUserAuth(!showUserAuth);
  };

  return (
    <Nav>
      <Hamburger onClick={toggleMenu}>
        <span />
        <span />
        <span />
      </Hamburger>
      <Menu isOpen={isOpen}>
        <MenuLink to="/" isActive={location.pathname === '/'} onClick={closeMenu}>{i18n.t('home')}</MenuLink>
        <MenuLink to="/exploremap" isActive={location.pathname === '/exploremap'} onClick={closeMenu}>{i18n.t('explore_map')}</MenuLink>
        <MenuLink to="/searchrecipes" isActive={location.pathname === '/searchrecipes'} onClick={closeMenu}>{i18n.t('search_recipes')}</MenuLink>
      </Menu>
      <RightSection>
        <LanguageSelector>
          <LanguageOption 
            selected={language === 'Es'} 
            onClick={() => handleLanguageChange('Es')}
          >
            Es
          </LanguageOption>
          |
          <LanguageOption 
            selected={language === 'En'} 
            onClick={() => handleLanguageChange('En')}
          >
            En
          </LanguageOption>
        </LanguageSelector>
        <LoginIcon onClick={toggleUserAuth}> {}
          <img src="https://www.pngkit.com/png/full/940-9406687_already-a-proact-user-employee-icon-white-png.png" alt="Login Icon" />
        </LoginIcon>
        {showUserAuth && <LoginAuth />} {}
      </RightSection>
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

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative; /* Para que el AuthContainer esté posicionado relativamente al RightSection */
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

const LoginIcon = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  img {
    height: 30px;
    width: 30px;
  }
`;

const LanguageSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    justify-content: center;
    width: auto; /* Permite que el selector de idioma se ajuste automáticamente */
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