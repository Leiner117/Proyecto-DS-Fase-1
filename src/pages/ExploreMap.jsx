import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import styled from 'styled-components';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const geoUrl = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';

const ExploreMap = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');

  const openModal = (country) => {
    setSelectedCountry(country);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <MapContainer>
        <ComposableMap>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const country = geo.properties.name || 'Desconocido';
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      document.body.style.cursor = 'pointer';
                    }}
                    onMouseLeave={() => {
                      document.body.style.cursor = 'default';
                    }}
                    onClick={() => openModal(country)}
                    style={{
                      default: {
                        fill: '#D6D6DA',
                        outline: 'none',
                      },
                      hover: {
                        fill: '#f0a500',
                        outline: 'none',
                      },
                      pressed: {
                        fill: '#000000',
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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Selected Country"
        style={modalStyles}
      >
        <h2>{`You have seleted ${selectedCountry}`}</h2>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default ExploreMap;

const MapContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};