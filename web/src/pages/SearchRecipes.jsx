import React from 'react';
import styled from 'styled-components';
import Card from '../components/Card';

const SearchRecipes = () => {
  return (
    <Gallery>
      <Card 
        image="https://via.placeholder.com/300x200.png?text=Tomato" 
        title="Tomate" 
        country="México" 
      />
      <Card 
        image="https://via.placeholder.com/300x200.png?text=Carrot" 
        title="Zanahoria" 
        country="España" 
      />
      <Card 
        image="https://via.placeholder.com/300x200.png?text=Onion" 
        title="Cebolla" 
        country="Italia" 
      />
      <Card 
        image="https://via.placeholder.com/300x200.png?text=Garlic" 
        title="Ajo" 
        country="Francia" 
      />
    </Gallery>
  );
};

export default SearchRecipes;

const Gallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
`;