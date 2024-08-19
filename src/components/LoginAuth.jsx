import React, { useState, useEffect } from 'react';
import { signInWithGoogle, logOut, auth } from '../firebaseConfig';
import styled from 'styled-components';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DEFAULT_PROFILE_PICTURE_URL = "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-male-icon.png";

const LoginAuth = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        const photoURL = user.photoURL || DEFAULT_PROFILE_PICTURE_URL;
        setUser({ ...user, photoURL });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const clearFields = (keepEmail = false) => {
    if (!keepEmail) {
      setEmail('');
    }
    setPassword('');
    setConfirmPassword('');
    setName('');
  };

  const handleEmailLogin = () => {
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        if (userCredential.user.emailVerified) {
          setUser(userCredential.user);
          window.location.reload();
        } else {
          toast.error('Please verify your email before logging in.');
          auth.signOut();
        }
      })
      .catch((error) => {
        toast.error(error.message);
        console.error("Error during email sign in:", error);
      });
  };

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const passwordRequirements = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRequirements.test(password)) {
      toast.error('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        updateProfile(userCredential.user, {
          displayName: name,
          photoURL: DEFAULT_PROFILE_PICTURE_URL,
        }).then(() => {
          sendEmailVerification(userCredential.user)
            .then(() => {
              toast.success('Verification email sent. Please check your inbox and verify your email.');
              clearFields(true);
              setIsRegistering(false);
            })
            .catch((error) => {
              toast.error('Failed to send verification email.');
              console.error("Error during email verification:", error);
            });
        });
      })
      .catch((error) => {
        toast.error(error.message);
        console.error("Error during registration:", error);
      });
  };

  const handleGoogleLogin = () => {
    signInWithGoogle()
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error.message);
        console.error("Error during Google sign in:", error);
      });
  };

  const handleLogout = () => {
    logOut()
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error.message);
        console.error("Error during sign out:", error);
      });
  };

  const navigate = useNavigate();
  const handleViewFavorites = () => {
    navigate('/favoriterecipes');
  };

  return (
    <AuthContainer>
      <ToastContainer />
      {user ? (
        <>
          <UserInfo>
            <img src={user.photoURL} alt="User Avatar" />
            <p>Welcome, {user.displayName}</p>
          </UserInfo>
          <FavoritesButton onClick={handleViewFavorites}>
            My Favorite Recipes
          </FavoritesButton>
          <Button onClick={handleLogout}>Logout</Button>
        </>
      ) : (
        <>
          {isRegistering ? (
            <>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
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
              <PasswordRequirements>
                Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.
              </PasswordRequirements>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
              />
              <Button onClick={handleRegister}>Sign Up</Button>
              <ToggleText onClick={() => { setIsRegistering(false); clearFields(); }}>
                Already have an account? Sign In
              </ToggleText>
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
              <Button onClick={handleEmailLogin}>Sign In</Button>
              <ToggleText onClick={() => { setIsRegistering(true); clearFields(); }}>
                Don't have an account? Sign Up
              </ToggleText>
            </>
          )}
          <Separator>Other Ways to Sign In</Separator>
          <Button onClick={handleGoogleLogin}>Sign in with Google</Button>
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
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;

  img {
    border-radius: 50%;
    width: 100px;
    height: 100px;
    margin-bottom: 10px;
    object-fit: cover;
  }

  p {
    margin: 0;
    font-weight: bold;
    color: white;
    text-align: center;
  }
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #f0a500;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 10px;
  width: 100%;

  &:hover {
    background-color: #d48800;
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

const PasswordRequirements = styled.p`
  color: #ccc;
  font-size: 0.8rem;
  margin: -8px 0 10px 0;
`;

const ToggleText = styled.p`
  color: white;
  font-size: 0.9rem;
  text-align: center;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 10px;
`;

const Separator = styled.p`
  color: white;
  font-size: 1rem;
  text-align: center;
  margin: 20px 0 10px;
  border-top: 1px solid #ccc;
  padding-top: 10px;
`;