import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

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
        console.error("Error fetching recipe:", error);
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
        <TitleArea>
          <Title>{recipe.strMeal}</Title>
          <Area>{recipe.strArea}</Area>
        </TitleArea>
        <Ingredients>
          <h3>Ingredients:</h3>
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

const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #333;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Area = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  color: #666;
  text-align: center;
`;

const Instructions = styled.p`
  font-size: 18px;
  line-height: 1.6;
  text-align: left;
  margin-top: 20px; /* Espacio entre ingredientes e instrucciones */
`;

const Ingredients = styled.div`
  text-align: left;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  margin-bottom: 20px; /* Espacio entre ingredientes e instrucciones */

  th, td {
    border: 1px solid #ddd;
    padding: 12px; /* Aumenta el padding para más espacio */
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
    font-size: 1.1rem; /* Aumenta el tamaño de la fuente */
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
  }
`;

const Video = styled.div`
  margin-top: 20px;

  iframe {
    width: 100%;
    height: 315px;
  }

  a {
    font-size: 18px;
    color: blue;
    text-decoration: underline;
  }
`;