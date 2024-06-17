import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { registerUserApi } from '@api';
import { useNavigate } from 'react-router-dom';
import { useSelector } from '../../services/store';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const authed = useSelector((state) => state.auth.authorized);

  useEffect(() => {
    if (authed) {
      navigate('/');
    }
  }, []);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    registerUserApi({ name: userName, email: email, password: password }).then(
      (data) => {
        if (data) {
          navigate('/login');
        }
      }
    );
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
