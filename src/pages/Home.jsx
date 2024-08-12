import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Card from '../components/Card';
import Modal from '../components/Modal';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const fetchedRecipes = [];
        for (let i = 0; i < 4; i++) {
          const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
          const data = await response.json();
          const meal = data.meals[0];
          fetchedRecipes.push({
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
            ] : []
          });
        }
        setRecipes(fetchedRecipes);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleCardClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <HomeContainer>
      <Title>Nuestras Recetas Recomendadas</Title>
      <CardSection>
        {recipes.map((recipe, index) => (
          <Card
            key={index}
            image={recipe.image}
            title={recipe.title}
            country={recipe.country}
            onClick={() => handleCardClick(recipe)}
          />
        ))}
      </CardSection>

      <ObjectiveTitle>Objetivo de Nuestra Web</ObjectiveTitle>
      <Paragraph>
        La idea de nuestra página es proporcionar recetas fáciles, rápidas y saludables para estudiantes universitarios. Sabemos que la vida universitaria puede ser agitada y, a menudo, encontrar tiempo para preparar una comida adecuada es un desafío. Por eso, hemos reunido una variedad de recetas que se ajustan a los horarios ocupados y los presupuestos limitados.
      </Paragraph>
      <Paragraph>
        Nuestro objetivo es ayudar a los estudiantes a mantener una dieta equilibrada, proporcionando ideas de comidas que no solo son nutritivas, sino que también son fáciles de preparar. Con nuestras recetas, esperamos inspirar a los estudiantes a experimentar en la cocina y descubrir que comer bien no tiene que ser complicado ni costoso.
      </Paragraph>
      <Paragraph>
        Además, muchas de nuestras recetas están diseñadas para ser adaptables, lo que significa que pueden ajustarse según los ingredientes que tengas a mano o las preferencias dietéticas que puedas tener. ¡Nos encanta ayudar a los estudiantes a comer bien y sentirse bien, sin importar su nivel de habilidad en la cocina!
      </Paragraph>
      
      {/* Modal para mostrar los detalles de la receta seleccionada */}
      <Modal show={showModal} onClose={handleCloseModal} recipe={selectedRecipe} />
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
