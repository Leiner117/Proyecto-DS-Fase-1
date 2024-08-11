import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from '../components/Card';
import Modal from '../components/Modal';

const SearchRecipes = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('name');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const fetchedRecipes = [];
        for (let i = 0; i < 10; i++) {
          const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
          const data = await response.json();
          const meal = data.meals[0];
          fetchedRecipes.push({
            image: meal.strMealThumb,
            title: meal.strMeal,
            country: meal.strArea,
            instructions: meal.strInstructions
          });
        }
        setRecipes(fetchedRecipes);
        setFilteredRecipes(fetchedRecipes);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleSearch = () => {
    const filtered = recipes.filter((recipe) => {
      if (filter === 'name') {
        return recipe.title.toLowerCase().includes(search.toLowerCase());
      } else if (filter === 'country') {
        return recipe.country.toLowerCase().includes(search.toLowerCase());
      } else if (filter === 'include') {
        return recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(search.toLowerCase()));
      } else if (filter === 'exclude') {
        return !recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(search.toLowerCase()));
      }
      return false;
    });
    setFilteredRecipes(filtered);
  };

  const handleCardClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <SearchForm>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar recetas..."
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="name">Nombre</option>
          <option value="country">País</option>
          <option value="include">Incluir Ingrediente</option>
          <option value="exclude">Excluir Ingrediente</option>
        </select>
        <button type="button" onClick={handleSearch}>Buscar</button>
      </SearchForm>
      <Gallery>
        {filteredRecipes.map((recipe, index) => (
          <Card
            key={index}
            image={recipe.image}
            title={recipe.title}
            country={recipe.country}
            onClick={() => handleCardClick(recipe)}
          />
        ))}
      </Gallery>
      <Modal show={showModal} onClose={handleCloseModal} recipe={selectedRecipe} />
    </div>
  );
};

export default SearchRecipes;

const SearchForm = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;

  input {
    padding: 10px;
    margin-right: 10px;
    width: 300px;
  }

  select {
    padding: 10px;
    margin-right: 10px;
  }

  button {
    padding: 10px 20px;
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