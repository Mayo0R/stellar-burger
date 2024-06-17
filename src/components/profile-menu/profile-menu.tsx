import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { logoutApi } from '@api';
import { deleteCookie } from '../../utils/cookie';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/services/store';
import { clearData } from '../../services/slices/userAuthSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    logoutApi()
      .then(() => {
        dispatch(clearData());
        navigate('/');
      })
      .catch((error) => {
        console.error('Logout failed', error);
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
