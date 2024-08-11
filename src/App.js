import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ExploreMap from './pages/ExploreMap';
import SearchRecipes from './pages/SearchRecipes';
import Login from './pages/Login';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Satisfy&display=swap');

  body {
    font-family: 'Satisfy', cursive;
    padding-top: 60px;  /* Add padding to avoid content being hidden behind the navbar */
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorarmapa" element={<ExploreMap />} />
          <Route path="/buscarrecetas" element={<SearchRecipes />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;