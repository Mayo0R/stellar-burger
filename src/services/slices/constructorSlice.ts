import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';

interface ConstructorState {
  bun: TConstructorIngredient | null;
  constructorIngredients: TConstructorIngredient[];
}

const initialState: ConstructorState = {
  bun: null,
  constructorIngredients: []
};

const constructorSlice = createSlice({
  name: 'constructorBurger',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (action.payload.type === 'bun') {
        state.bun = action.payload;
      } else {
        state.constructorIngredients.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.constructorIngredients = state.constructorIngredients.filter(
        (item) => item.id !== action.payload
      );
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.constructorIngredients = [];
    },
    moveItemUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const temp = state.constructorIngredients[index];
        state.constructorIngredients[index] =
          state.constructorIngredients[index - 1];
        state.constructorIngredients[index - 1] = temp;
      }
    },
    moveItemDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.constructorIngredients.length - 1) {
        const temp = state.constructorIngredients[index];
        state.constructorIngredients[index] =
          state.constructorIngredients[index + 1];
        state.constructorIngredients[index + 1] = temp;
      }
    }
  }
});

export const {
  addItem,
  removeItem,
  clearConstructor,
  moveItemUp,
  moveItemDown
} = constructorSlice.actions;
export default constructorSlice.reducer;
