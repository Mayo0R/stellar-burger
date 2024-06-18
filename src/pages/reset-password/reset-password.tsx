import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { ResetPasswordUI } from '@ui-pages';
import { resetPassword } from '../../services/actions/authActions';
import { unwrapResult } from '@reduxjs/toolkit';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const authed = useSelector((state) => state.auth.authorized);

  useEffect(() => {
    if (authed) {
      navigate('/');
    }
  }, [authed, navigate]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const resultAction = await dispatch(resetPassword({ password, token }));
      const data = unwrapResult(resultAction);
      if (data.success) {
        localStorage.removeItem('resetPassword');
        navigate('/login');
      } else {
        setError(new Error('Password reset failed'));
      }
    } catch (error) {
      setError(new Error('Password reset failed'));
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
