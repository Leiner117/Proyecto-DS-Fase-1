import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db, auth } from '../firebaseConfig'; // Asegúrate de que estas rutas estén correctas
import { collection, getDocs, query, where } from 'firebase/firestore';
import removeFavoriteRecipe from '../components/RemoveFavoriteRecipe';

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
  width: 100%;
  max-width: 500px;
  margin-top: 20px;
`;

const RecipeItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const NoRecipesMessage = styled.p`
  text-align: center;
  color: #777;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;

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
            return data.meals ? { id: doc.id, ...data.meals[0] } : null;
          } catch (apiError) {
            console.error("Error al obtener la receta de la API:", apiError);
            return null;
          }
        })
      );

      setFavoriteRecipes(recipesData.filter(recipe => recipe !== null));
    } catch (err) {
      console.error("Error al obtener las recetas favoritas:", err);
    }
  } else {
    setError("User not logged in.");
  }
};

const FavoriteRecipes = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [error, setError] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    fetchFavorites(user, setFavoriteRecipes, setError);
  }, [user]);

  const handleRemoveFavorite = async (recipeId) => {
    try {
      await removeFavoriteRecipe(recipeId);
      // Vuelve a consultar las recetas después de eliminar
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
            <RecipeItem key={recipe.id}>
              <p>{recipe.strMeal}</p>
              <button onClick={() => handleRemoveFavorite(recipe.idMeal)}>
                Remove from Favorites
              </button>
            </RecipeItem>
          ))
        ) : (
          <NoRecipesMessage>You have no favorite recipes.</NoRecipesMessage>
        )}
      </RecipesList>
    </FavoriteRecipesContainer>
  );
};

export default FavoriteRecipes;
