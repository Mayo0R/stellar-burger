import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/userAuthSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, []);

  const userOrders: TOrder[] = useSelector((state) => state.auth.orders);
  const ordersAreLoading = useSelector((state) => state.auth.ordersIsLoading);

  if (ordersAreLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={userOrders} />;
};
