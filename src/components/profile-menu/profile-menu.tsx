import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { logoutApi } from '@api';
import { useDispatch } from '../../services/store';
import { clearData } from '../../services/slices/userAuthSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
