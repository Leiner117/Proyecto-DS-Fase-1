import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export const saveFavoriteRecipe = async (recipeId) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("Usuario no autenticado");
    return;
  }

  const userId = user.uid;
  try {
    await setDoc(doc(db, 'favorites', `${userId}_${recipeId}`), {
      userId: userId,
      recipeId: recipeId,
    });
    console.log("Receta guardada como favorita");
  } catch (error) {
    console.error("Error al guardar la receta favorita: ", error);
  }
};

export default saveFavoriteRecipe;