import Axios from "@/hooks/useAxios";
import type { AxiosError } from "axios";

export type RegisterPayload = {
  name: string;
  email: string;
  phone?: string;
  password: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      avatar: string | null;
      type: string;
      status: string;
      lastLogin: string | null;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      avatar: string | null;
      type: string;
      status: string;
      lastLogin: string | null;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};

export type CurrentUserResponse = {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
      avatar: string | null;
      type: string;
      status: string;
      lastLogin: string | null;
      createdAt: string;
      updatedAt: string;
    };
  };
};

const getErrorMessage = (error: unknown) => {
  const axiosError = error as AxiosError<{ message?: string }>;

  return (
    axiosError?.response?.data?.message ||
    axiosError?.message ||
    "Registration failed. Please try again."
  );
};

export const registerUser = async (payload: RegisterPayload): Promise<RegisterResponse> => {
  try {
    const response = await Axios.post<RegisterResponse>(
      "/auth/register",
      payload,
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const loginUser = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await Axios.post<LoginResponse>(
      "/auth/login",
      payload,
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const logoutUser = async (): Promise<LogoutResponse> => {
  try {
    const response = await Axios.post<LogoutResponse>(
      "/auth/logout",
      {},
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  try {
    const response = await Axios.get<CurrentUserResponse>(
      "/auth/me",
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
