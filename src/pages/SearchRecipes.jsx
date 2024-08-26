import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';  // Importamos toast para mostrar las notificaciones
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import { useTranslation } from 'react-i18next';

const SearchRecipes = () => {
  const { i18n } = useTranslation("global");
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [includeIngredient, setIncludeIngredient] = useState('');
  const [excludeIngredient, setExcludeIngredient] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const user = auth.currentUser;

  // Fetch favorite recipes from Firebase
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
    window.scrollTo(0, 0);
    if (user) {
      fetchFavoriteRecipes();
    }
  }, [user, fetchFavoriteRecipes]);

  // Fetch data for areas, ingredients, and categories
  useEffect(() => {
    const fetchFiltersData = async () => {
      try {
        const areaResponse = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
        const areaData = await areaResponse.json();
        setAreas(areaData.meals.map(meal => meal.strArea));

        const ingredientResponse = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
        const ingredientData = await ingredientResponse.json();
        // Sort ingredients alphabetically
        const sortedIngredients = ingredientData.meals
          .map(meal => meal.strIngredient)
          .sort((a, b) => a.localeCompare(b));
        setIngredients(sortedIngredients);

        const categoryResponse = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
        const categoryData = await categoryResponse.json();
        setCategories(categoryData.meals.map(meal => meal.strCategory));
      } catch (error) {
        console.error("Error fetching filter data:", error);
        setError(error);
      }
    };

    fetchFiltersData();
  }, []);

  const resetAdvancedFilters = () => {
    setAreaFilter('');
    setIncludeIngredient('');
    setExcludeIngredient('');
    setCategoryFilter('');
  };

  const applyFilters = (recipes) => {
    let filtered = recipes;

    if (areaFilter.trim() !== '') {
      filtered = filtered.filter(recipe => 
        recipe.origin.toLowerCase().includes(areaFilter.toLowerCase())
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

    if (categoryFilter.trim() !== '') {
      filtered = filtered.filter(recipe => 
        recipe.category && recipe.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    return filtered;
  };

  const viewAllRecipes = async () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let allRecipes = [];
  
    setLoading(true);
    setError(null);
    setShowAdvancedSearch(false);  // Ocultar la búsqueda avanzada
    setSearch('');  // Reiniciar el input de nombre
    resetAdvancedFilters();  // Reiniciar los filtros avanzados
  
    try {
      const fetches = alphabet.split('').map(async (letter) => {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
        const data = await response.json();
        return data.meals ? data.meals.map(meal => ({
          id: meal.idMeal,
          image: meal.strMealThumb,
          title: meal.strMeal,
          origin: meal.strArea,
          category: meal.strCategory,
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
  
      if (allRecipes.length === 0) {
        setFilteredRecipes([]);
        toast.info(i18n.t("search_no_result"));
      } else {
        setFilteredRecipes(allRecipes);
      }
  
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
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
          origin: meal.strArea,
          category: meal.strCategory,
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
  
      const filtered = applyFilters(allRecipes);  // Aplicar los filtros seleccionados
  
      if (filtered.length === 0) {
        setFilteredRecipes([]);
        toast.info(i18n.t("search_no_result"));
      } else {
        setFilteredRecipes(filtered);
      }
  
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  

  const handleSearch = async () => {
    if (search.trim() === '') {
      // Si no hay input de nombre, pero hay filtros avanzados o está visible la búsqueda avanzada, aplicamos filtros
      if (showAdvancedSearch || areaFilter || includeIngredient || excludeIngredient || categoryFilter) {
        fetchAllRecipes();  // Aquí se aplican los filtros
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
          origin: meal.strArea,
          category: meal.strCategory,
          instructions: meal.strInstructions,
          ingredients: [
            meal.strIngredient1,
            meal.strIngredient2,
            meal.strIngredient3,
            meal.strIngredient4,
            meal.strIngredient5,
          ].filter(Boolean)
        })) : [];
        const filtered = applyFilters(fetchedRecipes);
  
        if (filtered.length === 0) {
          setFilteredRecipes([]);
          toast.info(i18n.t("search_no_result"));
        } else {
          setFilteredRecipes(filtered);
        }
  
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
    <Container>
      <SearchForm>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={i18n.t('search_name')}
        />
        <button type="button" onClick={handleSearch}>{i18n.t("search")}</button>
        <button type="button" onClick={handleToggleAdvancedSearch}>
          {showAdvancedSearch ? i18n.t('hide_search') : i18n.t('show_search')}
        </button>
        <button type="button" onClick={viewAllRecipes}>{i18n.t("view_all")}</button>
      </SearchForm>

      {showAdvancedSearch && (
        <AdvancedSearchForm>
          <FilterGroup>
            <label>{i18n.t("filter_area")}:</label>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
            >
              <option value="">{i18n.t("select_area")}:</option>
              {areas.map((area, index) => (
                <option key={index} value={area}>{area}</option>
              ))}
            </select>
          </FilterGroup>
          <FilterGroup>
            <label>{i18n.t("include_ingredient")}:</label>
            <select
              value={includeIngredient}
              onChange={(e) => setIncludeIngredient(e.target.value)}
            >
              <option value="">{i18n.t("select_ingredient")}:</option>
              {ingredients.map((ingredient, index) => (
                <option key={index} value={ingredient}>{ingredient}</option>
              ))}
            </select>
          </FilterGroup>
          <FilterGroup>
            <label>{i18n.t("exclude_ingredient")}:</label>
            <select
              value={excludeIngredient}
              onChange={(e) => setExcludeIngredient(e.target.value)}
            >
              <option value="">{i18n.t("select_ingredient")}:</option>
              {ingredients.map((ingredient, index) => (
                <option key={index} value={ingredient}>{ingredient}</option>
              ))}
            </select>
          </FilterGroup>
          <FilterGroup>
            <label>{i18n.t("filter_category")}:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">{i18n.t("select_category")}</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </FilterGroup>
        </AdvancedSearchForm>
      )}

      {loading && <Spinner />}
      {error && <ErrorMessage>Error: {error.message}</ErrorMessage>}
      <Gallery>
        {filteredRecipes.map((recipe) => (
          <Card
            key={recipe.id}
            id={recipe.id}
            image={recipe.image}
            title={recipe.title}
            origin={recipe.origin}
            isFavorite={favoriteRecipes.includes(recipe.id)}
          />
        ))}
      </Gallery>
    </Container>
  );
};

export default SearchRecipes;

const Container = styled.div`
  padding: 20px;
`;

const SearchForm = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  flex-wrap: wrap;

  input {
    padding: 10px;
    margin-right: 10px;
    width: 300px;
    margin-top: -8px;

    @media (max-width: 768px) {
      margin-right: 5px;
      width: 250px;
    }

    @media (max-width: 480px) {
      margin-right: 0;
      width: 200px;
      margin-bottom: 10px;
      margin-top: 0; /* Resetea el margen superior en pantallas pequeñas */
    }
  }

  button {
    padding: 10px 20px;
    background-color: #f0a500;
    color: white;
    border: none;
    cursor: pointer;
    margin-right: 10px;
    margin-bottom: 10px;

    &:hover {
      background-color: #d48800;
    }

    @media (max-width: 768px) {
      margin-right: 5px;
      padding: 8px 16px;
    }

    @media (max-width: 480px) {
      margin-right: 0;
      width: 100%;
      text-align: center;
      padding: 8px 16px;
    }
  }
`;

const AdvancedSearchForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;

  @media (max-width: 768px) {
    align-items: stretch;
  }
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

    @media (max-width: 480px) {
      text-align: left;
      margin-right: 5px;
    }
  }

  select {
    padding: 10px;
    width: 70%;
    flex: 2;

    @media (max-width: 480px) {
      width: 65%;
    }
  }
`;

const Gallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;