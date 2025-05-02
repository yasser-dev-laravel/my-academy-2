import axios from "@/utils/api/axios";

const BASE_URL = "/api/Users";

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  address?: string | null;
  roleId: number;
}

export interface UpdateUserDto {
  id: number;
  name: string;
  email: string;
  password?: string | null;
  phone?: string | null;
  address?: string | null;
  roleId: number;
}

export interface UserDto {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  roleIds?:number [] | null;
}

export interface UserDtoPaginationResult {
  data?: UserDto[] | null;
  total: number;
}

export interface LoginResponse {
  accessToken(accessToken: any): unknown;
  token: string;
  user: UserDto;
}

export const loginUser = async (userNameOrEmail: string, password: string): Promise<LoginResponse> => {
  const res = await axios.post<LoginResponse>(`/api/Auth/login`, { userNameOrEmail, password });
  return res.data;
}

export const createUser = async (data: CreateUserDto): Promise<number> => {
  const res = await axios.post<number>(`${BASE_URL}`, data);
  return res.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const updateUser = async (id: number, data: UpdateUserDto): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, data);
};

export const getUser = async (id: number): Promise<any> => {
  const res = await axios.get<UserDto>(`${BASE_URL}/${id}`);
  return res.data;
};

export const restoreUser = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/restore/${id}`);
};

export const getUsersPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
  OnlyDeleted?: boolean;
}): Promise<UserDtoPaginationResult> => {
  const res = await axios.get<UserDtoPaginationResult>(`${BASE_URL}/pagination`, { params });
  const { data, total } = res.data || {};
  return {
    data: data ?? [],
    total: typeof total === "number" ? total : 0,
  };
};
