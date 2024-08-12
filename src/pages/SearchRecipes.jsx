import React, { useState } from 'react';
import styled from 'styled-components';
import Card from '../components/Card';
import Modal from '../components/Modal';

const SearchRecipes = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('name');
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleSearch = async () => {
    if (filter === 'name' && search.trim() !== '') {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`);
        const data = await response.json();
        const fetchedRecipes = data.meals ? data.meals.map(meal => ({
          image: meal.strMealThumb,
          title: meal.strMeal,
          country: meal.strArea,
          instructions: meal.strInstructions,
          ingredients: [
            meal.strIngredient1,
            meal.strIngredient2,
            meal.strIngredient3,
            meal.strIngredient4,
            meal.strIngredient5,
          ].filter(Boolean)  // Filtra los ingredientes no nulos
        })) : [];
        setRecipes(fetchedRecipes);
        setFilteredRecipes(fetchedRecipes);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    } else {
      const filtered = recipes.filter((recipe) => {
        if (filter === 'country') {
          return recipe.country.toLowerCase().includes(search.toLowerCase());
        } else if (filter === 'include') {
          return recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(search.toLowerCase()));
        } else if (filter === 'exclude') {
          return !recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(search.toLowerCase()));
        }
        return false;
      });
      setFilteredRecipes(filtered);
    }
  };

  const handleCardClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
  };

  return (
    <div>
      <SearchForm>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Recipes..."
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="name">Name</option>
          <option value="country">Country</option>
          <option value="include">Include Ingredient</option>
          <option value="exclude">Exclude Ingredient</option>
        </select>
        <button type="button" onClick={handleSearch}>Search</button>
      </SearchForm>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
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
