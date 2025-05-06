import axios from "./axios";
import { API_BASE_URL } from "./constants";
const BASE_URL = `${API_BASE_URL}/Roles`;


export interface CreateRoleDto {
  name: string;
}

export interface UpdateRoleDto {
  id: number;
  name: string;
}

export interface RoleDto {
  id: number;
  name: string;
}

export interface RoleDtoPaginationResult {
  data?: RoleDto[] | null;
  total: number;
}

export const createRole = async (data: CreateRoleDto): Promise<number> => {
  const res = await axios.post<number>(`${BASE_URL}`, data);
  return res.data;
};

export const deleteRole = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const updateRole = async (id: number, data: UpdateRoleDto): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, data);
};

export const getRole = async (id: number): Promise<any> => {
  const res = await axios.get<RoleDto>(`${BASE_URL}/${id}`);
  return res.data;
};

export const restoreRole = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/restore/${id}`);
};

export const getRolesPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
  OnlyDeleted?: boolean;
}): Promise<RoleDtoPaginationResult> => {
  const res = await axios.get<RoleDtoPaginationResult>(`${BASE_URL}/pagination`, { params });
  const { data, total } = res.data || {};
  return {
    data: data ?? [],
    total: typeof total === "number" ? total : 0,
  };
};
