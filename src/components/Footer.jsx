import React from 'react';
import styled from 'styled-components';
import githubLogo from '../img/github.png';
import linkedinLogo from '../img/linkedin.png';
import { useTranslation } from 'react-i18next';
const Footer = () => {
  const { i18n } = useTranslation("global");
  return (
    <FooterContainer>
      <ApiSection>
        <a href="https://www.themealdb.com/" target="_blank" rel="noopener noreferrer">
          <ApiLogo src="https://www.thesportsdb.com/images/logo-tmdb.png" alt="TheMealDB Logo" />
        </a>
        <ApiText>
          {i18n.t('recipe_information provided_by')} <ApiLink href="https://www.themealdb.com/" target="_blank" rel="noopener noreferrer">TheMealDB</ApiLink>.
        </ApiText>
      </ApiSection>

      <DeveloperSection>
        <DevHeader>{i18n.t('developed by')}:</DevHeader>
        <Developer>
          <p>Kevin Jiménez</p>
          <IconLink href="https://linkedin.com/in/kvnjt" target="_blank" rel="noopener noreferrer">
            <img src={linkedinLogo} alt="LinkedIn" />
          </IconLink>
          <IconLink href="https://github.com/Khraben" target="_blank" rel="noopener noreferrer">
            <img src={githubLogo} alt="GitHub" />
          </IconLink>
        </Developer>

        <Developer>
          <p>Leiner Alvarado</p>
          <IconLink href="https://www.linkedin.com/in/leiner-alvarado-357725247/" target="_blank" rel="noopener noreferrer">
            <img src={linkedinLogo} alt="LinkedIn" />
          </IconLink>
          <IconLink href="https://github.com/Leiner117" target="_blank" rel="noopener noreferrer">
            <img src={githubLogo} alt="GitHub" />
          </IconLink>
        </Developer>

        <Developer>
          <p>Walter Lazo</p>
          <IconLink href="https://www.linkedin.com/in/walter-lazo-gonzález-76942b302" target="_blank" rel="noopener noreferrer">
            <img src={linkedinLogo} alt="LinkedIn" />
          </IconLink>
          <IconLink href="https://github.com/Walter-Lz" target="_blank" rel="noopener noreferrer">
            <img src={githubLogo} alt="GitHub" />
          </IconLink>
        </Developer>
      </DeveloperSection>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.footer`
  background: #333;
  color: white;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  position: relative;
  bottom: 0;
  left: 0;

  @media (max-width: 768px) {
    padding: 15px 5px;
    gap: 15px;
  }
`;

const ApiSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  text-align: center;
`;

const ApiLogo = styled.img`
  height: 30px; /* Reducido el tamaño del logo */
  width: auto;

  @media (max-width: 768px) {
    height: 25px; /* Ajuste para pantallas más pequeñas */
  }
`;

const ApiText = styled.p`
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ApiLink = styled.a`
  color: #f0a500;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const DeveloperSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const DevHeader = styled.h3`
  font-size: 1.2rem;
  color: #f0a500;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 5px;
  }
`;

const Developer = styled.div`
  text-align: center;

  p {
    margin: 0;
    font-size: 1rem;

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
`;

const IconLink = styled.a`
  display: inline-block;
  margin: 5px;

  img {
    height: 25px;
    width: 25px;
    transition: transform 0.2s ease-in-out;

    &:hover {
      transform: scale(1.2);
    }

    @media (max-width: 768px) {
      height: 20px;
      width: 20px;
    }
  }
`;
