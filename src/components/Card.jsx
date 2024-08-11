import React from 'react';
import styled from 'styled-components';

const Card = ({ image, title, country,onClick }) => {
  return (
    <CardContainer onClick={onClick}>
      <Image src={image} alt={title} />
      <Content>
        <Title>{title}</Title>
        <Country>{country}</Country>
      </Content>
    </CardContainer>
  );
};

export default Card;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  margin: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  overflow: hidden;
  background: #e6e6e6;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 3px solid #f0a500;
`;

const Content = styled.div`
  padding: 20px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 10px;
`;

const Country = styled.p`
  font-size: 1.2rem;
  color: #777;
`;