import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import {
  removeItem,
  moveItemUp,
  moveItemDown
} from '../../services/slices/constructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(moveItemDown(index));
    };

    const handleMoveUp = () => {
      dispatch(moveItemUp(index));
    };

    const handleClose = (ingredient: TConstructorIngredient) => {
      dispatch(removeItem(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={() => handleClose(ingredient)}
      />
    );
  }
);
