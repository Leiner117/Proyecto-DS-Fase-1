import React, { useState, useEffect } from 'react';
import { signInWithGoogle, logOut, auth } from '../firebaseConfig';
import styled from 'styled-components';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { FacebookAuthProvider, OAuthProvider } from 'firebase/auth';

const LoginAuth = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleEmailLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        setError(error.message);
        console.error("Error during email sign in:", error);
      });
  };

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        setError(error.message);
        console.error("Error during registration:", error);
      });
  };

  const handleGoogleLogin = () => {
    signInWithGoogle().catch((error) => {
      console.error("Error during Google sign in:", error);
    });
  };

  const handleFacebookLogin = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider).catch((error) => {
      console.error("Error during Facebook sign in:", error);
    });
  };

  const handleMicrosoftLogin = () => {
    const provider = new OAuthProvider('microsoft.com');
    signInWithPopup(auth, provider).catch((error) => {
      console.error("Error during Microsoft sign in:", error);
    });
  };

  const handleLogout = () => {
    logOut().catch((error) => {
      console.error("Error during sign out:", error);
    });
  };

  const handleViewFavorites = () => {
    console.log('Ver recetas favoritas');
  };

  return (
    <AuthContainer>
      {user ? (
        <>
          <UserInfo>
            <img src={user.photoURL} alt="User Avatar" />
            <p>Hola, {user.displayName}</p>
          </UserInfo>
          <Button onClick={handleLogout}>Logout</Button>
          <FavoritesButton onClick={handleViewFavorites}>Ver Recetas Favoritas</FavoritesButton>
        </>
      ) : (
        <>
          {isRegistering ? (
            <>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              {error && <ErrorText>{error}</ErrorText>}
              <Button onClick={handleRegister}>Register</Button>
              <ToggleText onClick={() => setIsRegistering(false)}>Already have an account? Log in</ToggleText>
            </>
          ) : (
            <>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              {error && <ErrorText>{error}</ErrorText>}
              <Button onClick={handleEmailLogin}>Login</Button>
              <ToggleText onClick={() => setIsRegistering(true)}>Don't have an account? Register</ToggleText>
            </>
          )}
          <Separator>Otros Métodos de Ingreso</Separator>
          <Button onClick={handleGoogleLogin}>Sign in with Google</Button>
          <Button onClick={handleFacebookLogin}>Sign in with Facebook</Button>
          <Button onClick={handleMicrosoftLogin}>Sign in with Microsoft</Button>
        </>
      )}
    </AuthContainer>
  );
};

export default LoginAuth;

const AuthContainer = styled.div`
  position: absolute;
  top: 45px;
  right: -20px;
  background-color: #333;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 250px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;

  img {
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }

  p {
    margin: 0;
    font-weight: bold;
    color: white;
  }
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #4285F4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 10px;
  width: 100%;

  &:hover {
    background-color: #357AE8;
  }
`;

const FavoritesButton = styled(Button)`
  background-color: #f0a500;

  &:hover {
    background-color: #d48800;
  }
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ToggleText = styled.p`
  color: white;
  font-size: 0.9rem;
  text-align: center;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 10px;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 10px;
`;

const Separator = styled.p`
  color: white;
  font-size: 1rem;
  text-align: center;
  margin: 20px 0 10px;
  border-top: 1px solid #ccc;
  padding-top: 10px;
`;
