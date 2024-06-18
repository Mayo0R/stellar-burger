import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/newOrderSlice';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
  }, [number, dispatch]);

  const orderData = useSelector((state) => state.order.orderData);
  const status = useSelector((state) => state.order.status);
  const storedIngredients: TIngredient[] = useSelector(
    (state) => state.ingredients.items
  );

  const ingredients: TIngredient[] = [];

  orderData?.ingredients.forEach((ingredientId) => {
    const matchedIngredient = storedIngredients.find(
      (storedIngredient) => storedIngredient._id === ingredientId
    );
    if (matchedIngredient) {
      ingredients.push(matchedIngredient);
    }
  });

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (status === 'loading') {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <div>Order not found</div>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
