import { FC, useMemo, useState } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { TNewOrderResponse, getOrdersApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { current } from '@reduxjs/toolkit';
import { setDesiredUrl } from '../../services/slices/userAuthSlice';
import { useDispatch, useSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const authed = useSelector((state) => state.auth.authorized);
  const [orderRequest, setOrderRequest] = useState(false);
  const [orderModalData, setOrderModalData] = useState<TOrder | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { bun, constructorIngredients } = useSelector(
    (state) => state.constructorBurger
  );

  const constructorItems = {
    bun: bun,
    ingredients: constructorIngredients || []
  };

  const onOrderClick = () => {
    if (!authed) {
      const currentLocation = location;
      dispatch(setDesiredUrl(currentLocation.pathname));
      navigate('/login');
    } else {
      if (!constructorItems.bun || orderRequest) return;

      const ingredientIds = [
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((item) => item._id),
        constructorItems.bun._id
      ];

      setOrderRequest(true);
      orderBurgerApi(ingredientIds)
        .then((data: TNewOrderResponse) => {
          setOrderModalData(data.order);
          setOrderRequest(false);
          dispatch(clearConstructor());
        })
        .catch((error) => {
          console.error(error);
          setOrderRequest(false);
        });
    }
  };

  const closeOrderModal = () => {
    setOrderModalData(null);
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
