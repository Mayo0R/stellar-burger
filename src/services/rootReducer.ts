import { combineReducers } from 'redux';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import ordersReducer from './slices/ordersSlice';
import authReducer from './slices/userAuthSlice';
import orderReducer from './slices/newOrderSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorBurger: constructorReducer,
  orders: ordersReducer,
  auth: authReducer,
  order: orderReducer
});

export default rootReducer;
