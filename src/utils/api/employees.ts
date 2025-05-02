import axios from "./axios";
import { API_BASE_URL } from "./constants";
const BASE_URL = `${API_BASE_URL}/Employees`;


export interface CreateEmployeeDto {
  email: string;
  name: string;
  password?: string | null;
  phone?: string | null;
  address?: string | null;
  nationalId?: string | null;
  cityId?: number | null;
  department?: string | null;
  salary: number;
  salaryTypeId?: number | null;
  jobTitle?: string | null;
}

export interface UpdateEmployeeDto {
  id: number;
  email: string;
  name: string;
  password?: string | null;
  phone?: string | null;
  address?: string | null;
  nationalId?: string | null;
  cityId?: number | null;
  department?: string | null;
  salary: number;
  salaryTypeId?: number | null;
  jobTitle?: string | null;
}

export interface EmployeeDto {
  id?: number | null;
  name: string;
  email: string;
  password?: string | null;
  phone?: string | null;
  address?: string | null;
  nationalId?: string | null;
  cityId?: number | null;
  department?: string | null;
  salary: number;
  salaryTypeId?: number | null;
  jobTitle?: string | null;
}

export interface EmployeeDtoPaginationResult {
  data?: EmployeeDto[] | null;
  total: number;
}

export const createEmployee = async (data: CreateEmployeeDto): Promise<number> => {
  const res = await axios.post<number>(`${BASE_URL}`, data);
  return res.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const updateEmployee = async (id: number, data: UpdateEmployeeDto): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, data);
};

export const getEmployee = async (id: number): Promise<any> => {
  const res = await axios.get<EmployeeDto>(`${BASE_URL}/${id}`);
  return res.data;
};

export const restoreEmployee = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/restore/${id}`);
};

export const getEmployeesPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
  OnlyDeleted?: boolean;
}): Promise<EmployeeDtoPaginationResult> => {
  const res = await axios.get<EmployeeDtoPaginationResult>(`${BASE_URL}/pagination`, { params });
  const { data, total } = res.data || {};
  return {
    data: data ?? [],
    total: typeof total === "number" ? total : 0,
  };
};
