import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ExploreMap from './pages/ExploreMap';
import SearchRecipes from './pages/SearchRecipes';
import { createGlobalStyle } from 'styled-components';
import FavoriteRecipes from './pages/FavoriteRecipes';
import { UserProvider } from './context/UserContext';
import PrivateRoute from './context/PrivateRoute';
import Footer from './components/Footer';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap'); 

  body {
    font-family: 'Playfair Display', serif;
    margin: 0;
    padding-top: 60px;
    background-color: #f4f4f4;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: normal;
  }

  p {
    margin: 0 0 1rem 0;
    line-height: 1.6;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* Breakpoints globales */
  @media (max-width: 768px) {
    body {
      font-size: 90%; /* Reduce ligeramente el tamaño de fuente */
    }

    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.75rem;
    }

    h3 {
      font-size: 1.5rem;
    }

    p {
      font-size: 1rem;
    }

    /* Ajustes adicionales para elementos que afectan a toda la app */
    .container {
      padding: 0 10px;
    }
  }

  @media (max-width: 480px) {
    body {
      font-size: 80%; /* Reduce aún más el tamaño de fuente en pantallas muy pequeñas */
    }

    h1 {
      font-size: 1.75rem;
    }

    h2 {
      font-size: 1.5rem;
    }

    h3 {
      font-size: 1.25rem;
    }

    p {
      font-size: 0.9rem;
    }
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <UserProvider>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/exploremap" element={<ExploreMap />} />
              <Route path="/searchrecipes" element={<SearchRecipes />} />
              <Route path="/favoriterecipes" element={<PrivateRoute component={FavoriteRecipes} />} />
            </Routes>
          </main>
          <Footer />
        </UserProvider>
      </Router>
    </>
  );
}

export default App;