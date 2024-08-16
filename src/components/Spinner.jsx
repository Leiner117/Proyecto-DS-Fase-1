import React from 'react';
import styled, { keyframes } from 'styled-components';

const Spinner = () => {
  return (
    <SpinnerOverlay>
      <SpinnerContainer />
    </SpinnerOverlay>
  );
};

export default Spinner;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerOverlay = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 999;
`;

const SpinnerContainer = styled.div`
  border: 16px solid #f3f3f3;
  border-top: 16px solid #f0a500;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: ${spin} 2s linear infinite;

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
    border-width: 12px;
  }

  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
    border-width: 8px;
  }
`;