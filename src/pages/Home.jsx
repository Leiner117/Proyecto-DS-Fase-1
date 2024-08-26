import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import { useTranslation } from 'react-i18next';
const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { i18n } = useTranslation("global");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchRecipes = async () => {
      try {
        const fetchPromises = Array.from({ length: 4 }, () =>
          fetch('https://www.themealdb.com/api/json/v1/1/random.php').then(response => response.json())
        );

        const results = await Promise.all(fetchPromises);
        const fetchedRecipes = results.map(data => {
          const meal = data.meals[0];
          return {
            id: meal.idMeal, // Asegúrate de que el ID se pasa correctamente
            image: meal.strMealThumb,
            title: meal.strMeal,
            country: meal.strArea,
            instructions: meal.strInstructions,
            ingredients: meal.strIngredient1 ? [
              meal.strIngredient1,
              meal.strIngredient2,
              meal.strIngredient3,
              meal.strIngredient4,
              meal.strIngredient5,
            ] : [],
          };
        });

        setRecipes(fetchedRecipes);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <HomeContainer>
      <Title>{i18n.t('recommended_recipes')}</Title>
      <CardSection>
        {recipes.map((recipe, index) => (
          <Card
            key={recipe.id} // Usa el ID único
            id={recipe.id}  // Pasa el ID al componente Card
            image={recipe.image}
            title={recipe.title}
            country={recipe.country}
          />
        ))}
      </CardSection>

      <ObjectiveTitle>{i18n.t('about_us')}</ObjectiveTitle>
      <Paragraph>
        {i18n.t('about_us1')}
      </Paragraph>
      <Paragraph>
        {i18n.t('about_us2')}
      </Paragraph>
      <Paragraph>
        {i18n.t('about_us3')}
      </Paragraph>
    </HomeContainer>
  );
};

export default Home;

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #000000;
  margin-bottom: 20px;
  text-align: center;
`;

const CardSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
`;

const ObjectiveTitle = styled.h2`
  font-size: 2rem;
  color: #000000;
  margin-bottom: 20px;
  text-align: center;
`;

const Paragraph = styled.p`
  font-size: 1.2rem;
  color: #000000;
  max-width: 800px;
  text-align: center;
  margin-bottom: 20px;
`;