import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

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
const FavoriteRecipes = ({ user }) => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      console.log("User:", user); 
      if (user) {
        try {
          const recipesRef = collection(db, 'favoriteRecipes');
          const q = query(recipesRef, where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          const recipes = querySnapshot.docs.map(doc => doc.data());
          setFavoriteRecipes(recipes);
        } catch (error) {
          console.error("Error fetching favorite recipes: ", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchFavoriteRecipes();
  }, [user]);

  if (loading) {
    return <p>Loading favorite recipes...</p>;
  }

  if (!user) {
    return <ErrorMessage>You need to log in to view your favorite recipes.</ErrorMessage>;
  }

  return (
    <FavoriteRecipesContainer>
      <UserInfo>
        <UserAvatar src={user.photoURL} alt="User Avatar" />
        <p>Welcome, {user.displayName}</p>
      </UserInfo>

      <RecipesList>
        {favoriteRecipes.length > 0 ? (
          favoriteRecipes.map((recipe, index) => (
            <RecipeItem key={index}>
              {recipe.name}
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
