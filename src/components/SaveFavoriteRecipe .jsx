import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const saveFavoriteRecipe = async (recipeId) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("Usuario no autenticado");
    return;
  }

  const userId = user.uid;
  try {
    await setDoc(doc(db, "RecetasFavoritas", `${userId}_${recipeId}`), {
      recipeId: recipeId,
      userId: userId,
    });
    console.log("Receta guardada como favorita");
  } catch (error) {
    console.error("Error al guardar la receta favorita: ", error);
  }
};

export default saveFavoriteRecipe;