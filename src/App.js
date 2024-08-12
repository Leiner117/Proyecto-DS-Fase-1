import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ExploreMap from './pages/ExploreMap';
import SearchRecipes from './pages/SearchRecipes';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap'); 

  body {
    font-family: 'Playfair Display', serif;
    padding-top: 60px;
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
        </Routes>
      </Router>
    </>
  );
}

export default App;