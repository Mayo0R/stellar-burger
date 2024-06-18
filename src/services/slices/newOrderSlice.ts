import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    const order = response.orders[0];
    return order;
  }
);

interface TInitialState {
  orderData: TOrder | null;
  status: string;
  error: null | string;
}

const initialState: TInitialState = {
  orderData: null,
  status: 'idle',
  error: null
};

const newOrderSlice = createSlice({
  name: 'new_order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.status = 'succeeded';
          state.orderData = action.payload;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      });
  }
});

export default newOrderSlice.reducer;
