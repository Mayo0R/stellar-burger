import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector((state) => state.auth.authIsChecking);
  const authed = useSelector((state) => state.auth.authorized);
  const location = useLocation();

  if (isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !authed) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && authed) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate replace to={from} />;
  }

  return children;
};
