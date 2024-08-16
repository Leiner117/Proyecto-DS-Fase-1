import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Message = ({ type, children }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return <MessageContainer type={type}>{children}</MessageContainer>;
};

export default Message;

const MessageContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  padding: 15px;
  margin: 10px 0;
  border-radius: 5px;
  color: white;
  background-color: ${({ type }) => {
    switch (type) {
      case 'success':
        return '#28a745';
      case 'error':
        return '#dc3545';
      case 'warning':
        return '#ffc107';
      default:
        return '#007bff';
    }
  }};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: opacity 0.5s ease-in-out;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`;