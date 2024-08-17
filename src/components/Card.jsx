import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Card = ({ id, image, title, origin }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (user) {
        const favoriteDocRef = doc(db, "RecetasFavoritas", `${user.uid}_${id}`);
        const docSnapshot = await getDoc(favoriteDocRef);
        setIsFavorite(docSnapshot.exists());
      }
    };
    checkIfFavorite();
  }, [user, id]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
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

  return (
    <CardContainer>
      <ImageContainer>
        <Image src={image} alt={title} />
        <FavoriteButton isFavorite={isFavorite} onClick={toggleFavorite} />
      </ImageContainer>
      <Content>
        <Title>{title}</Title>
        <Origin>{origin}</Origin>
      </Content>
    </CardContainer>
  );
};

export default Card;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 250px;
  margin: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
  background: #e6e6e6;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    width: 200px; /* Ajuste para pantallas medianas */
  }

  @media (max-width: 480px) {
    width: 150px; /* Ajuste para pantallas pequeñas */
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 150px;

  @media (max-width: 768px) {
    height: 120px; /* Ajuste para pantallas medianas */
  }

  @media (max-width: 480px) {
    height: 100px; /* Ajuste para pantallas pequeñas */
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-bottom: 2px solid #f0a500;
`;

const Content = styled.div`
  padding: 10px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.4rem; 
  color: #333;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 1.2rem; /* Ajuste para pantallas medianas */
  }

  @media (max-width: 480px) {
    font-size: 1rem; /* Ajuste para pantallas pequeñas */
  }
`;

const Origin = styled.p`
  font-size: 1rem; 
  color: #777;

  @media (max-width: 768px) {
    font-size: 0.9rem; /* Ajuste para pantallas medianas */
  }

  @media (max-width: 480px) {
    font-size: 0.8rem; /* Ajuste para pantallas pequeñas */
  }
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 5px;
  left: 5px;
  background: transparent;
  color: ${({ isFavorite }) => (isFavorite ? '#f0a500' : 'rgba(255, 255, 255, 0.8)')};
  border: none;
  cursor: pointer;
  font-size: 3rem;
  padding: 5px;
  transition: color 0.2s;

  &::before {
    content: '★';
    text-shadow: 
      -1px -1px 0 #000,  
      1px -1px 0 #000,  
      -1px 1px 0 #000,  
      1px 1px 0 #000;  /* Crea un borde negro en la estrella */
  }

  &:hover {
    color: ${({ isFavorite }) => (isFavorite ? '#ba1c00' : '#f0a500')};
  }

  @media (max-width: 768px) {
    font-size: 2.5rem; /* Ajuste para pantallas medianas */
  }

  @media (max-width: 480px) {
    font-size: 2rem; /* Ajuste para pantallas pequeñas */
  }
`;