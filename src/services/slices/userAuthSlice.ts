import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TAuthResponse, getUserApi, getOrdersApi } from '@api';
import { TUser, TOrder } from '@utils-types';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';
import {
  loginUser,
  updateUser,
  registerUser,
  resetPassword
} from '../actions/authActions';

interface AuthState {
  user: TUser;
  authIsChecking: boolean;
  authorized: boolean;
  orders: TOrder[];
  ordersIsLoading: boolean;
  desiredUrl: string | null;
}

const initialState: AuthState = {
  user: {
    name: '',
    email: ''
  },
  authIsChecking: false,
  authorized: false,
  orders: [],
  ordersIsLoading: false,
  desiredUrl: null
};

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, thunkAPI) => {
    const accessToken = getCookie('accessToken');
    if (accessToken) {
      const userResponse = await getUserApi();
      if (userResponse.success) {
        thunkAPI.dispatch(setUser(userResponse.user));
      } else {
        thunkAPI.dispatch(clearData());
      }
    } else {
      thunkAPI.dispatch(clearData());
    }
    thunkAPI.dispatch(finishAuthCheck());
  }
);

export const fetchUserOrders = createAsyncThunk(
  'auth/fetchOrders',
  async (_, thunkAPI) => {
    const orders = await getOrdersApi();
    return orders;
  }
);

const userAuthSlice = createSlice({
  name: 'user_auth',
  initialState,
  reducers: {
    startAuthCheck: (state) => {
      state.authIsChecking = true;
    },
    finishAuthCheck: (state) => {
      state.authIsChecking = false;
    },
    setData: (state, action: PayloadAction<TAuthResponse>) => {
      state.user = action.payload.user;
      state.authorized = action.payload.success;
      setCookie('accessToken', action.payload.accessToken, { expires: 3600 });
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.authorized = true;
    },
    clearData: (state) => {
      state.user = { name: '', email: '' };
      state.authorized = false;
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    },
    setDesiredUrl: (state, action: PayloadAction<string>) => {
      state.desiredUrl = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(checkAuth.pending, (state) => {
      state.authIsChecking = true;
    });
    builder.addCase(checkAuth.fulfilled, (state) => {
      state.authIsChecking = false;
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.authIsChecking = false;
      state.user = { name: '', email: '' };
      state.authorized = false;
    });
    builder.addCase(fetchUserOrders.pending, (state) => {
      state.ordersIsLoading = true;
    });
    builder.addCase(
      fetchUserOrders.fulfilled,
      (state, action: PayloadAction<TOrder[]>) => {
        state.orders = action.payload;
        state.ordersIsLoading = false;
      }
    );
    builder.addCase(fetchUserOrders.rejected, (state) => {
      state.ordersIsLoading = false;
    });
    builder.addCase(loginUser.pending, (state) => {
      state.authIsChecking = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.authIsChecking = false;
      if (action.payload.success) {
        state.user = action.payload.user;
        state.authorized = true;
      }
    });
    builder.addCase(loginUser.rejected, (state) => {
      state.authIsChecking = false;
      state.user = { name: '', email: '' };
      state.authorized = false;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.user = action.payload.user;
      }
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      // handle registration success if needed
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      // handle password reset success if needed
    });
  }
});

export const {
  startAuthCheck,
  finishAuthCheck,
  setData,
  setUser,
  clearData,
  setDesiredUrl
} = userAuthSlice.actions;
export default userAuthSlice.reducer;
