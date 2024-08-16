import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from '../components/Card';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const fetchPromises = Array.from({ length: 4 }, () =>
          fetch('https://www.themealdb.com/api/json/v1/1/random.php').then(response => response.json())
        );

        const results = await Promise.all(fetchPromises);
        const fetchedRecipes = results.map(data => {
          const meal = data.meals[0];
          return {
            id: meal.idMeal,
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <HomeContainer>
      <Title>Recommended Recipes</Title>
      <CardSection>
        {recipes.map((recipe, index) => (
          <Card
            key={index}
            image={recipe.image}
            title={recipe.title}
            country={recipe.country}
          />
        ))}
      </CardSection>

      <ObjectiveTitle>About Us</ObjectiveTitle>
      <Paragraph>
        The idea of our site is to provide easy, quick, and healthy recipes for college students. We know that college life can be hectic, and often finding time to prepare a proper meal is a challenge. That's why we've put together a variety of recipes to fit busy schedules and limited budgets.
      </Paragraph>
      <Paragraph>
        Our goal is to help students maintain a balanced diet by providing meal ideas that are not only nutritious but also easy to prepare. With our recipes, we hope to inspire students to experiment in the kitchen and discover that eating well doesn't have to be complicated or expensive.
      </Paragraph>
      <Paragraph>
        Plus, many of our recipes are designed to be adaptable, which means they can be adjusted based on ingredients you have on hand or dietary preferences you may have. We love helping students eat well and feel good, no matter what their skill level in the kitchen!
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