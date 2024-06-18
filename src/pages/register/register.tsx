import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { unwrapResult } from '@reduxjs/toolkit';
import { registerUser } from '../../services/actions/authActions';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authed = useSelector((state) => state.auth.authorized);

  useEffect(() => {
    if (authed) {
      navigate('/');
    }
  }, [authed, navigate]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(
        registerUser({ name: userName, email, password })
      );
      const data = unwrapResult(resultAction);
      if (data.success) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Failed to register user: ', error);
    }
  };

  return (
    <RegisterUI
      errorText=''
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
