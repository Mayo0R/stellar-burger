import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { TAuthResponse, loginUserApi } from '@api';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { setData } from '../../services/slices/userAuthSlice';
import { setCookie } from '../../utils/cookie';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authed = useSelector((state) => state.auth.authorized);
  const desiredUrl = useSelector((state) => state.auth.desiredUrl);

  useEffect(() => {
    if (authed) {
      if (desiredUrl) {
        navigate(desiredUrl);
      } else {
        navigate('/');
      }
    }
  }, [authed, desiredUrl, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    loginUserApi({ email, password }).then((data: TAuthResponse) => {
      if (data?.success) {
        dispatch(setData(data));
        setCookie('accessToken', data.accessToken, { expires: 3600 });
        localStorage.setItem('refreshToken', data.refreshToken);
        if (desiredUrl) {
          navigate(desiredUrl);
        } else {
          navigate('/');
        }
      }
    });
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
