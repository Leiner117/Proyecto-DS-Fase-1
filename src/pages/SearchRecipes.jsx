import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Card from '../components/Card';

const SearchRecipes = () => {
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [includeIngredient, setIncludeIngredient] = useState('');
  const [excludeIngredient, setExcludeIngredient] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const user = auth.currentUser;

  const fetchFavoriteRecipes = useCallback(async () => {
    if (user) {
      try {
        const favoritesQuery = query(
          collection(db, "RecetasFavoritas"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(favoritesQuery);
        const favorites = querySnapshot.docs.map((doc) => doc.data().recipeId);
        setFavoriteRecipes(favorites);
      } catch (err) {
        console.error("Error fetching favorite recipes:", err);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchFavoriteRecipes();
    }
  }, [user, fetchFavoriteRecipes]);

  const resetAdvancedFilters = () => {
    setCountryFilter('');
    setIncludeIngredient('');
    setExcludeIngredient('');
  };

  const fetchAllRecipes = async () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let allRecipes = [];

    setLoading(true);
    setError(null);

    try {
      const fetches = alphabet.split('').map(async (letter) => {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
        const data = await response.json();
        return data.meals ? data.meals.map(meal => ({
          id: meal.idMeal,
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
          ].filter(Boolean)
        })) : [];
      });

      const results = await Promise.all(fetches);
      allRecipes = results.flat();

      let filtered = allRecipes;
      if (countryFilter.trim() !== '') {
        filtered = filtered.filter(recipe => 
          recipe.country.toLowerCase().includes(countryFilter.toLowerCase())
        );
      }
      if (includeIngredient.trim() !== '') {
        filtered = filtered.filter(recipe => 
          recipe.ingredients.some(ingredient => 
            ingredient.toLowerCase().includes(includeIngredient.toLowerCase())
          )
        );
      }
      if (excludeIngredient.trim() !== '') {
        filtered = filtered.filter(recipe => 
          !recipe.ingredients.some(ingredient => 
            ingredient.toLowerCase().includes(excludeIngredient.toLowerCase())
          )
        );
      }

      setFilteredRecipes(filtered);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (search.trim() === '') {
      if (showAdvancedSearch) {
        if (!countryFilter && !includeIngredient && !excludeIngredient) {
          setFilteredRecipes([]);
        } else {
          fetchAllRecipes();
        }
      } else {
        setFilteredRecipes([]);
      }
    } else {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`);
        const data = await response.json();
        const fetchedRecipes = data.meals ? data.meals.map(meal => ({
          id: meal.idMeal,
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
          ].filter(Boolean)
        })) : [];
        setFilteredRecipes(fetchedRecipes);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }
  };

  const handleToggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
    if (showAdvancedSearch) {
      resetAdvancedFilters();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <SearchForm>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search Recipes by Name..."
        />
        <button type="button" onClick={handleSearch}>Search</button>
        <button type="button" onClick={handleToggleAdvancedSearch}>
          {showAdvancedSearch ? 'Hide Advanced Search' : 'Show Advanced Search'}
        </button>
        <button type="button" onClick={fetchAllRecipes}>View All</button>
      </SearchForm>

      {showAdvancedSearch && (
        <AdvancedSearchForm>
          <FilterGroup>
            <label>Filter by Country:</label>
            <input
              type="text"
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              placeholder="Filter by Country..."
            />
          </FilterGroup>
          <FilterGroup>
            <label>Include Ingredient:</label>
            <input
              type="text"
              value={includeIngredient}
              onChange={(e) => setIncludeIngredient(e.target.value)}
              placeholder="Include Ingredient..."
            />
          </FilterGroup>
          <FilterGroup>
            <label>Exclude Ingredient:</label>
            <input
              type="text"
              value={excludeIngredient}
              onChange={(e) => setExcludeIngredient(e.target.value)}
              placeholder="Exclude Ingredient..."
            />
          </FilterGroup>
        </AdvancedSearchForm>
      )}

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      <Gallery>
        {filteredRecipes.map((recipe) => (
          <Card
            key={recipe.id}
            id={recipe.id}
            image={recipe.image}
            title={recipe.title}
            country={recipe.country}
            isFavorite={favoriteRecipes.includes(recipe.id)}
          />
        ))}
      </Gallery>
    </div>
  );
};

export default SearchRecipes;

const SearchForm = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  input {
    padding: 10px;
    margin-right: 10px;
    width: 300px;
  }

  button {
    padding: 10px 20px;
    background-color: #f0a500;
    color: white;
    border: none;
    cursor: pointer;
    margin-right: 10px;
  }

  button:hover {
    background-color: #d48800;
  }
`;

const AdvancedSearchForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
  max-width: 500px;
  justify-content: space-between;

  label {
    margin-right: 10px;
    flex: 1;
    text-align: right;
  }

  input {
    padding: 10px;
    width: 70%;
    flex: 2;
  }
`;

const Gallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
`;