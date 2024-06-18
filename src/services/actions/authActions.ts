import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  TAuthResponse,
  loginUserApi,
  updateUserApi,
  registerUserApi,
  resetPasswordApi
} from '@api';
import { setData, setUser, clearData } from '../slices/userAuthSlice';
import { TUser } from '@utils-types';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    { email, password }: { email: string; password: string },
    { dispatch }
  ) => {
    const data: TAuthResponse = await loginUserApi({ email, password });

    if (data?.success) {
      dispatch(setData(data));
    } else {
      dispatch(clearData());
    }

    return data;
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (
    formValue: { name: string; email: string; password: string },
    { dispatch }
  ) => {
    const data = await updateUserApi(formValue);
    if (data?.success) {
      dispatch(setUser(formValue as TUser));
    }
    return data;
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({
    name,
    email,
    password
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    const data = await registerUserApi({ name, email, password });
    return data;
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ password, token }: { password: string; token: string }) => {
    const data = await resetPasswordApi({ password, token });
    return data;
  }
);
