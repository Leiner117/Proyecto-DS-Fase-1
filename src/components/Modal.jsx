import React from 'react';
import styled from 'styled-components';
import saveFavoriteRecipe from '../components/SaveFavoriteRecipe '
import { auth } from '../firebaseConfig';

const Modal = ({ show, onClose, recipe }) => {
  if (!show) {
    return null;
  }
  const handleAddToFavorites = async () => {
    const user = auth.currentUser; // Verificar si el usuario está autenticado
    if (!user) {
      alert("Debes estar logueado para agregar recetas a tus favoritos.");
      return; // Salir de la función si no hay usuario autenticado
    }
    try {
      await saveFavoriteRecipe(recipe.id);
      alert(`${recipe.title} ha sido agregado a tus favoritos!`);
    } catch (error) {
      console.error("Error al agregar la receta a favoritos:", error);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ImageSection>
          <Image src={recipe.image} alt={recipe.title} />
          <InfoSection>
            <Title>{recipe.title}</Title>
            <InfoText>{recipe.instructions}</InfoText>
          </InfoSection>
        </ImageSection>
        <AddToFavoritesButton onClick={handleAddToFavorites}>
          Add To My Favorites
        </AddToFavoritesButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 10px;
  width: 600px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ImageSection = styled.div`
  display: flex;
  align-items: center;
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
`;

const InfoSection = styled.div`
  flex-grow: 1;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
`;

const InfoText = styled.p`
  margin: 10px 0;
`;

const AddToFavoritesButton = styled.button`
  margin-top: 20px;
  background-color: #f0a500;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
