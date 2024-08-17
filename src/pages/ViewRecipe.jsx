import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
const ViewRecipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        setRecipe(data.meals[0]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <Spinner />;

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (recipe[`strIngredient${i}`]) {
      ingredients.push(
        `${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}`
      );
    }
  }

  return (
    <Container>
      <ImageSection>
        <Image src={recipe.strMealThumb} alt={recipe.strMeal} />
      </ImageSection>
      <InfoSection>
        <Title>{recipe.strMeal}</Title>
        <Category>{recipe.strCategory}</Category>
        <Area>{recipe.strArea}</Area>
        <Ingredients>
          <h3>Ingredients:</h3>
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </Ingredients>
        <Instructions>{recipe.strInstructions}</Instructions>
        {recipe.strYoutube && (
          <Video>
            <h3>Video:</h3>
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${recipe.strYoutube.split('v=')[1]}`}
              title={recipe.strMeal}
              frameBorder="0"
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

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Category = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #666;
`;

const Area = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #666;
  margin-bottom: 20px;
`;

const Instructions = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  text-align: left;
  color: #444;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Ingredients = styled.div`
  text-align: left;
  margin-top: 20px;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #555;
  }
`;

const Video = styled.div`
  margin-top: 30px;
  iframe {

    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }
`;