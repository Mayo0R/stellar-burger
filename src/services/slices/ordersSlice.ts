import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrdersData, TFeedsResponse } from '@utils-types';

const initialState: TOrdersData = {
  orders: [],
  total: 0,
  totalToday: 0
};

export const fetchOrders = createAsyncThunk<TFeedsResponse>(
  'orders/fetchOrders',
  async () => {
    const response = await getFeedsApi();
    return response;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    cleanOrders: (state) => {
      state.orders = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchOrders.fulfilled,
      (state, action: PayloadAction<TFeedsResponse>) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      }
    );
  }
});

export const { cleanOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
