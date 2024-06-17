import { FC, useEffect } from 'react';
import { TOrder } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { FeedInfoUI } from '../ui/feed-info';
import { fetchOrders } from '../../services/slices/ordersSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);
  const orders: TOrder[] = useSelector((state) => state.orders.orders);
  const total = useSelector((state) => state.orders.total);
  const totalToday = useSelector((state) => state.orders.totalToday);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  const feed = { total, totalToday };

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
