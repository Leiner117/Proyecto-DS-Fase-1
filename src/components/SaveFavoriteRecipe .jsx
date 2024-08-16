import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const saveFavoriteRecipe = async (recipeId) => {
  const user = auth.currentUser;
  if (!user) {
    toast.error("Usuario no autenticado");
    return;
  }

  const userId = user.uid;
  const favoriteDocRef = doc(db, "RecetasFavoritas", `${userId}_${recipeId}`);

  try {
    // Verificar si la receta ya está en favoritos
    const docSnapshot = await getDoc(favoriteDocRef);

    if (docSnapshot.exists()) {
      // La receta ya está en favoritos
      toast.info("Esta receta ya está en tus favoritos.");
    } else {
      // Guardar la receta como favorita
      await setDoc(doc(db, "RecetasFavoritas", `${userId}_${recipeId}`), {
        recipeId: recipeId,
        userId: userId,
      });
      toast.success("La receta ha sido agregada a tus favoritos!");
     
    }
  } catch (error) {
    toast.error("Error al guardar la receta favorita.");
  }
};

export default saveFavoriteRecipe;