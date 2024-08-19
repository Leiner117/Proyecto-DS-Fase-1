import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Card from '../components/Card';
import Spinner from '../components/Spinner'; 

const FavoriteRecipes = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchFavorites = async () => {
      if (!user) {
        setError("User not logged in.");
        setLoading(false); 
        return;
      }

      try {
        const favoritesQuery = query(
          collection(db, "RecetasFavoritas"),
          where("userId", "==", user.uid)
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
      } finally {
        setLoading(false); 
      }
    };

    fetchFavorites();
  }, [user]);

  if (loading) {
    return <Spinner />; 
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <FavoriteRecipesContainer>
      {user && (
        <UserInfo>
          <UserAvatar src={user.photoURL} alt="User Avatar" />
          <h3>{user.displayName}! These are your favorite recipes:</h3>
        </UserInfo>
      )}
      <RecipesList>
        {favoriteRecipes.length > 0 ? (
          favoriteRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              id={recipe.id}
              image={recipe.image}
              title={recipe.title}
              country={recipe.country}
            />
          ))
        ) : (
          <NoRecipesMessage>You have no favorite recipes.</NoRecipesMessage>
        )}
      </RecipesList>
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

const NoRecipesMessage = styled.p`
  text-align: center;
  color: #777;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
`;