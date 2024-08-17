import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import styled from 'styled-components';
import Modal from 'react-modal';
import Card from '../components/Card'; // Asegúrate de que el componente Card esté en la ruta correcta
import Spinner from '../components/Spinner';

Modal.setAppElement('#root');

const geoUrl = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';
const mealDbUrl = 'https://www.themealdb.com/api/json/v1/1/list.php?a=list';

// Mapeo manual entre áreas culinarias y países
const areaToCountryMap = {
  'American': 'USA',
  'British': 'England',
  'Canadian': 'Canada',
  'Chinese': 'China',
  'Croatian': 'Croatia',
  'Dutch': 'Netherlands',
  'Egyptian': 'Egypt',
  'Filipino': 'Philippines',
  'French': 'France',
  'Greek': 'Greece',
  'Indian': 'India',
  'Irish': 'Ireland',
  'Italian': 'Italy',
  'Jamaican': 'Jamaica',
  'Japanese': 'Japan',
  'Kenyan': 'Kenya',
  'Malaysian': 'Malaysia',
  'Mexican': 'Mexico',
  'Moroccan': 'Morocco',
  'Polish': 'Poland',
  'Portuguese': 'Portugal',
  'Russian': 'Russia',
  'Spanish': 'Spain',
  'Thai': 'Thailand',
  'Tunisian': 'Tunisia',
  'Turkish': 'Turkey',
  'Ukrainian': 'Ukraine',
  'Vietnamese': 'Vietnam',
};

const ExploreMap = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validCountries, setValidCountries] = useState([]);

  useEffect(() => {
    // Fetch the list of valid areas from the API
    fetch(mealDbUrl)
      .then((response) => response.json())
      .then((data) => {
        const areas = data.meals.map((meal) => meal.strArea);
        // Map areas to countries
        const countries = areas.map(area => areaToCountryMap[area]).filter(Boolean);
        setValidCountries(countries);
      })
      .catch((error) => console.error('Error fetching areas:', error));
  }, []);

  const fetchRecipesByArea = async (area) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
      const data = await response.json();
      setRecipes(data.meals || []);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryClick = (country) => {
    const area = Object.keys(areaToCountryMap).find(key => areaToCountryMap[key] === country);
    if (area) {
      setSelectedCountry(country);
      setSelectedArea(area);
      fetchRecipesByArea(area);
    }
  };

  const handleCleanSearch = () => {
    setSelectedCountry('');
    setSelectedArea('');
    setRecipes([]);
  };

  return (
    <div>
      <Title>Let's Explore the World's Recipes:</Title>
      
      <MapContainer>
        <ComposableMap>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const country = geo.properties.name || 'Unknown';
                const isValid = validCountries.includes(country);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      if (isValid) document.body.style.cursor = 'pointer';
                    }}
                    onMouseLeave={() => {
                      document.body.style.cursor = 'default';
                    }}
                    onClick={() => isValid && handleCountryClick(country)}
                    style={{
                      default: {
                        fill: isValid ? '#D6D6DA' : '#e0e0e0',
                        outline: 'none',
                      },
                      hover: {
                        fill: isValid ? '#f0a500' : '#e0e0e0',
                        outline: 'none',
                      },
                      pressed: {
                        fill: isValid ? '#000000' : '#e0e0e0',
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </MapContainer>

      {loading && <Spinner />}
      {error && <ErrorMessage>Error: {error.message}</ErrorMessage>}
      
      {recipes.length > 0 && (
        <div>
          <ObjectiveTitle>Here are the recipes from {selectedCountry}:</ObjectiveTitle>
          <Gallery>
            {recipes.map((recipe) => (
              <Card
                key={recipe.idMeal}
                id={recipe.idMeal}
                image={recipe.strMealThumb}
                title={recipe.strMeal}
                origin={selectedArea}
              />
            ))}
          </Gallery>
          <Button onClick={handleCleanSearch}>Clean Search</Button>
        </div>
      )}
    </div>
  );
};

export default ExploreMap;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #000000;
  margin-bottom: 20px;
  text-align: center;
  padding: 20px;
`;

const MapContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const ObjectiveTitle = styled.h2`
  font-size: 2rem;
  color: #000000;
  margin-bottom: 20px;
  text-align: center;
`;

const Gallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
`;

const Button = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  background-color: #f0a500;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #d48800;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;
