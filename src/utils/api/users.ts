import axios from "./axios";
import { API_BASE_URL } from "./constants";
const BASE_URL = `${API_BASE_URL}/Users`;



export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  address?: string | null;
  roleId: number;
  image?: string | null;
  nationalId: "string" | null;
  cityId: 0;
  education: "string" | null;
  salaryTypeId: 0;
  salary: 0;
  roleIds: number[];
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
  const res = await axios.post<LoginResponse>(`/Auth/login`, { userNameOrEmail, password });
  return res.data;
}

// Increase timeout and add logging for debugging network issues
export const createUser = async (data: CreateUserDto): Promise<number> => {
  console.log("[CREATE USER] URL:", `${BASE_URL}`); // Log the URL
  console.log("[CREATE USER] Payload:", data); // Log the payload
  const res = await axios.post<number>(`${BASE_URL}`, data, { timeout: 20000 }); // Increased timeout to 20 seconds
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
