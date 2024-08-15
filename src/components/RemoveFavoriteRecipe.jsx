import { doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const removeFavoriteRecipe = async (recipeId) => {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    try {
      await deleteDoc(doc(db, 'RecetasFavoritas', `${userId}_${recipeId}`));
      console.log("Receta eliminada de favoritos");
    } catch (error) {
      console.error("Error al eliminar la receta favorita: ", error);
    }
  } else {
    console.error("Usuario no autenticado");
  }
};
export default removeFavoriteRecipe;