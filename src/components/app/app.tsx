import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '@components';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Location,
  Navigate
} from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Modal, OrderInfo, IngredientDetails } from '@components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchOrders } from '../../services/slices/ordersSlice';
import { checkAuth } from '../../services/slices/userAuthSlice';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  children: React.ReactElement;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const authIsChecking = useSelector((state) => state.auth.authIsChecking);
  const authed = useSelector((state) => state.auth.authorized);
  const location = useLocation();

  if (authIsChecking) {
    return <Preloader />;
  }

  if (!authed) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(fetchIngredients());
    dispatch(fetchOrders());
  }, [dispatch]);

  const authIsChecking = useSelector((state) => state.auth.authIsChecking);

  if (authIsChecking) {
    return (
      <div className={styles.app}>
        <Preloader />
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={state?.backgroundLocation || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/profile'>
          <Route
            index
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='orders'
            element={
              <ProtectedRoute>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
      </Routes>

      {state?.backgroundLocation && (
        <>
          <Routes>
            <Route
              path='/feed/:number'
              element={
                <Modal
                  title='Детали заказа'
                  onClose={() => {
                    navigate(-1);
                  }}
                >
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path='/ingredients/:id'
              element={
                <Modal
                  title='Детали ингредиента'
                  onClose={() => {
                    navigate(-1);
                  }}
                >
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <Modal
                    title='Детали заказа'
                    onClose={() => {
                      navigate(-1);
                    }}
                  >
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              }
            />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
