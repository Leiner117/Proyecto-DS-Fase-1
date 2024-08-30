import React, { useState, useEffect } from 'react';
import { signInWithGoogle, logOut, auth } from '../firebaseConfig';
import styled from 'styled-components';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
const DEFAULT_PROFILE_PICTURE_URL = "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-male-icon.png";

const LoginAuth = () => {
  const { i18n } = useTranslation("global");
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
      toast.error(i18n.t('fill_in_fields'));
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        if (userCredential.user.emailVerified) {
          setUser(userCredential.user);
          window.location.reload();
        } else {
          toast.error(i18n.t('verify_email'));
          auth.signOut();
        }
      })
      .catch((error) => {
        toast.error(error.message);
        console.error(i18n.t("error_email")+":", error);
      });
  };

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      toast.error(i18n.t('fill_in_fields'));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(i18n.t('passwords_not_match'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(i18n.t('invalid_email'));
      return;
    }

    const passwordRequirements = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRequirements.test(password)) {
      toast.error(i18n.t('password_lenght'));
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
              toast.success(i18n.t('verification_email_sent'));
              clearFields(true);
              setIsRegistering(false);
            })
            .catch((error) => {
              toast.error(i18n.t('error_email_verification'));
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
            <p>{i18n.t('Welcome')}, {user.displayName}</p>
          </UserInfo>
          <FavoritesButton onClick={handleViewFavorites}>
            {i18n.t('favorite_recipes')}
          </FavoritesButton>
          <Button onClick={handleLogout}>{i18n.t('logout')}</Button>
        </>
      ) : (
        <>
          {isRegistering ? (
            <>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={i18n.t('name')}
              />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={i18n.t('email')}
              />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={i18n.t('password')}
              />
              <PasswordRequirements>
                {i18n.t('password_requirements')}
              </PasswordRequirements>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={i18n.t('confirm_password')}
              />
              <Button onClick={handleRegister}>{i18n.t("sign_up")}</Button>
              <ToggleText onClick={() => { setIsRegistering(false); clearFields(); }}>
                {i18n.t('sign_in_have_account')}
              </ToggleText>
            </>
          ) : (
            <>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={i18n.t('email')}
              />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={i18n.t('password')}
              />
              <Button onClick={handleEmailLogin}>{i18n.t('sign_in')}</Button>
              <ToggleText onClick={() => { setIsRegistering(true); clearFields(); }}>
                {i18n.t('sign_up_dont_have_account')}
              </ToggleText>
            </>
          )}
          <Separator>{i18n.t('other_ways_sign_in')}</Separator>
          <Button onClick={handleGoogleLogin}>{i18n.t('sign_with_google')}</Button>
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