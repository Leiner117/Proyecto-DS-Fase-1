import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import removeFavoriteRecipe from '../components/RemoveFavoriteRecipe';
import Modal from '../components/Modal';

const fetchFavorites = async (user, setFavoriteRecipes, setError) => {
  if (user) {
    const userId = user.uid;
    try {
      const favoritesQuery = query(
        collection(db, "RecetasFavoritas"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(favoritesQuery);

      const recipesData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const recipeId = doc.data().recipeId;
          try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
            const data = await response.json();
            const meal = data.meals ? data.meals[0] : null;
            return meal
              ? {
                  id: meal.idMeal,
                  image: meal.strMealThumb,
                  title: meal.strMeal,
                  country: meal.strArea,
                  instructions: meal.strInstructions,
                }
              : null;
          } catch (apiError) {
            console.error("Error al obtener la receta de la API:", apiError);
            return null;
          }
        })
      );

      setFavoriteRecipes(recipesData.filter((recipe) => recipe !== null));
    } catch (err) {
      console.error("Error al obtener las recetas favoritas:", err);
      setError("Error fetching favorite recipes.");
    }
  } else {
    setError("User not logged in.");
  }
};

const FavoriteRecipes = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    fetchFavorites(user, setFavoriteRecipes, setError);
  }, [user]);

  const handleCardClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
  };

  const handleRemoveFavorite = async (recipeId) => {
    try {
      await removeFavoriteRecipe(recipeId);
      fetchFavorites(user, setFavoriteRecipes, setError);
    } catch (err) {
      console.error("Error al eliminar la receta favorita:", err);
    }
  };

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }
  return (
    <FavoriteRecipesContainer>
      <UserInfo>
        {user && (
          <>
            <UserAvatar src={user.photoURL} alt="User Avatar" />
            <p>Welcome, {user.displayName}</p>
          </>
        )}
      </UserInfo>
      <RecipesList>
        {favoriteRecipes.length > 0 ? (
          favoriteRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} onClick={() => handleCardClick(recipe)}>
              <RecipeImage src={recipe.image} alt={recipe.title} />
              <RecipeTitle>{recipe.title}</RecipeTitle>
              <RecipeCountry>{recipe.country}</RecipeCountry>
              <RemoveButton onClick={(e) => {
                e.stopPropagation(); // Evitar que se dispare el modal al hacer clic en el botón
                handleRemoveFavorite(recipe.id);
              }}>
                Remove
              </RemoveButton>
            </RecipeCard>
          ))
        ) : (
          <NoRecipesMessage>You have no favorite recipes.</NoRecipesMessage>
        )}
      </RecipesList>
      {showModal && selectedRecipe && (
        <Modal show={showModal} recipe={selectedRecipe} onClose={handleCloseModal} />
      )}
    </FavoriteRecipesContainer>
  );
};
export default FavoriteRecipes;

const FavoriteRecipesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const UserInfo = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const UserAvatar = styled.img`
  border-radius: 50%;
  width: 100px;
  height: 100px;
`;

const RecipesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const RecipeCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 150px;
  border-radius: 8px;
  object-fit: cover;
`;

const RecipeTitle = styled.h3`
  margin: 10px 0 5px 0;
  font-size: 1.1rem;
  text-align: center;
`;

const RecipeCountry = styled.p`
  color: #777;
  font-size: 0.9rem;
  text-align: center;
`;

const NoRecipesMessage = styled.p`
  text-align: center;
  color: #777;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;
const RemoveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ff6347;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #ff4500;
  }
`;