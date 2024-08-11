import React, { useState } from 'react';
import styled from 'styled-components';
import Card from '../components/Card';

// Datos de ejemplo para las recetas
const recipes = [
  { image: 'https://via.placeholder.com/300x200.png?text=Tomato', title: 'Tomate', country: 'México', ingredients: ['tomato', 'salt'] },
  { image: 'https://via.placeholder.com/300x200.png?text=Carrot', title: 'Zanahoria', country: 'España', ingredients: ['carrot', 'sugar'] },
  { image: 'https://via.placeholder.com/300x200.png?text=Onion', title: 'Cebolla', country: 'Italia', ingredients: ['onion', 'pepper'] },
  { image: 'https://via.placeholder.com/300x200.png?text=Garlic', title: 'Ajo', country: 'Francia', ingredients: ['garlic', 'butter'] },
];

const SearchRecipes = () => {
  const [search, setSearch] = useState({ name: '', country: '', include: '', exclude: '' });
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    const { name, country, include, exclude } = search;
    const filtered = recipes.filter((recipe) => {
      return (
        (name === '' || recipe.title.toLowerCase().includes(name.toLowerCase())) &&
        (country === '' || recipe.country.toLowerCase().includes(country.toLowerCase())) &&
        (include === '' || recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(include.toLowerCase()))) &&
        (exclude === '' || !recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(exclude.toLowerCase())))
      );
    });
    setFilteredRecipes(filtered);
  };

  return (
    <div>
      <SearchForm>
        <label>
          Nombre:
          <input type="text" name="name" value={search.name} onChange={handleChange} />
        </label>
        <label>
          País:
          <input type="text" name="country" value={search.country} onChange={handleChange} />
        </label>
        <label>
          Incluir Ingrediente:
          <input type="text" name="include" value={search.include} onChange={handleChange} />
        </label>
        <label>
          Excluir Ingrediente:
          <input type="text" name="exclude" value={search.exclude} onChange={handleChange} />
        </label>
        <button type="button" onClick={handleSearch}>Buscar</button>
      </SearchForm>
      <Gallery>
        {filteredRecipes.map((recipe, index) => (
          <Card
            key={index}
            image={recipe.image}
            title={recipe.title}
            country={recipe.country}
          />
        ))}
      </Gallery>
    </div>
  );
};

export default SearchRecipes;

const SearchForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;

  label {
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  input {
    padding: 5px;
    margin-top: 5px;
    width: 200px;
  }

  button {
    padding: 10px 20px;
    margin-top: 10px;
    background-color: #f0a500;
    color: white;
    border: none;
    cursor: pointer;
  }

  button:hover {
    background-color: #d48800;
  }
`;

const Gallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
`;