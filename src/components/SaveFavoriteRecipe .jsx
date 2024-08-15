import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const saveFavoriteRecipe = async (recipeId) => {
  const user = auth.currentUser;
  if (!user) {
    console.error("Usuario no autenticado");
    return;
  }

  const userId = user.uid;
  const favoriteDocRef = doc(db, "RecetasFavoritas", `${userId}_${recipeId}`);

  try {
    // Verificar si la receta ya está en favoritos
    const docSnapshot = await getDoc(favoriteDocRef);

    if (docSnapshot.exists()) {
      // La receta ya está en favoritos
      alert("Esta receta ya está en tus favoritos.");
    } else {
      // Guardar la receta como favorita
      await setDoc(doc(db, "RecetasFavoritas", `${userId}_${recipeId}`), {
      recipeId: recipeId,
      userId: userId,
    });
      alert(`La receta ha sido agregada a tus favoritos!`);
      console.log("Receta guardada como favorita");
    }
  } catch (error) {
    console.error("Error al guardar la receta favorita: ", error);
  }
};

export default saveFavoriteRecipe;