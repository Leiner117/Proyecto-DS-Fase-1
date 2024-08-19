import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../components/Spinner';

const ViewRecipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    // Scroll al inicio de la página al montar el componente
    window.scrollTo(0, 0);

    const fetchRecipe = async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        setRecipe(data.meals[0]);
        setLoading(false);

        if (user) {
          const favoriteDocRef = doc(db, "RecetasFavoritas", `${user.uid}_${id}`);
          const docSnapshot = await getDoc(favoriteDocRef);
          setIsFavorite(docSnapshot.exists());
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) {
      toast.info("Must Sign in to use this feature!");
      return;
    }

    try {
      const favoriteDocRef = doc(db, "RecetasFavoritas", `${user.uid}_${id}`);
      if (isFavorite) {
        await deleteDoc(favoriteDocRef);
        setIsFavorite(false);
        toast.warn("Recipe deleted as favorite!");
      } else {
        await setDoc(favoriteDocRef, { recipeId: id, userId: user.uid });
        setIsFavorite(true);
        toast.success("Recipe added as favorite!");
      }
    } catch (error) {
      toast.error("Error adding favorite recipe!");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`]) {
      ingredients.push(`${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}`);
    }
  }

  return (
    <Container>
      <ImageSection>
        <Image src={recipe.strMealThumb} alt={recipe.strMeal} />
      </ImageSection>
      <InfoSection>
        <TitleArea>
          <Title>{recipe.strMeal}</Title>
          <Area>{recipe.strArea}</Area>
        </TitleArea>
        <FavoriteButton isFavorite={isFavorite} onClick={toggleFavorite}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </FavoriteButton>
        <Ingredients>
          <ObjectiveTitle>Ingredients:</ObjectiveTitle>
          <Table>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Measure</th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((ingredient, index) => {
                const [ingredientName, measure] = ingredient.split(' - ');
                return (
                  <tr key={index}>
                    <td>{ingredientName}</td>
                    <td>{measure}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <ObjectiveTitle>Instructions:</ObjectiveTitle>
        </Ingredients>
        <Instructions>{recipe.strInstructions}</Instructions>
        {recipe.strYoutube && (
          <Video>
            <ObjectiveTitle>Video:</ObjectiveTitle>
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${recipe.strYoutube.split('v=')[1]}`}
              title={recipe.strMeal}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Video>
        )}
      </InfoSection>
    </Container>
  );
};

export default ViewRecipe;

const Container = styled.div`
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ImageSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Image = styled.img`
  width: 100%;
  max-width: 500px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const InfoSection = styled.div`
  text-align: center;
`;

const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #000000;
  margin-bottom: 20px;
  text-align: center;
`;

const ObjectiveTitle = styled.h2`
  font-size: 2rem;
  color: #000000;
  margin-bottom: 20px;
  text-align: center;
`;

const Area = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #666;
`;

const Ingredients = styled.div`
  text-align: left;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  margin-bottom: 20px;

  th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
    font-size: 1.1rem;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
  }
`;

const Instructions = styled.p`
  font-size: 18px;
  line-height: 1.6;
  text-align: left;
  margin-top: 20px;
`;

const FavoriteButton = styled.button`
  background-color: ${({ isFavorite }) => (isFavorite ? '#ba1c00' : '#f0a500')};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ isFavorite }) => (isFavorite ? '#a00000' : '#d48000')};
  }
`;

const Video = styled.div`
  margin-top: 20px;
  padding: 20px;

  iframe {
    width: 100%;
    height: 315px;
  }
`;