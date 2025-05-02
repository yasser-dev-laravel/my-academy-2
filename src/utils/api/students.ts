import axios from "./axios";
import { API_BASE_URL } from "./constants";
const BASE_URL = `${API_BASE_URL}/Students`;


export interface CreateStudentDto {
  name: string;
  phone: string;
  birthDate?: string | null;
  genderId?: number | null;
  address?: string | null;
  parentPhone?: string | null;
  notes?: string | null;
}

export interface UpdateStudentDto {
  id: number;
  name: string;
  phone: string;
  birthDate?: string | null;
  genderId?: number | null;
  address?: string | null;
  parentPhone?: string | null;
  notes?: string | null;
}

export interface StudentDto {
  id: number;
  name: string;
  phone: string;
  birthDate?: string | null;
  genderId?: number | null;
  address?: string | null;
  parentPhone?: string | null;
  notes?: string | null;
}

export interface StudentDtoPaginationResult {
  data?: StudentDto[] | null;
  total: number;
}

export const createStudent = async (data: CreateStudentDto): Promise<number> => {
  const res = await axios.post<number>(`${BASE_URL}`, data);
  return res.data;
};

export const deleteStudent = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const updateStudent = async (id: number, data: UpdateStudentDto): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, data);
};

export const getStudent = async (id: number): Promise<any> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const restoreStudent = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/restore/${id}`);
};

export const getStudentsPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
  OnlyDeleted?: boolean;
}): Promise<StudentDtoPaginationResult> => {
  const res = await axios.get<StudentDtoPaginationResult>(`${BASE_URL}/pagination`, { params });
  const { data, total } = res.data || {};
  return {
    data: data ?? [],
    total: typeof total === "number" ? total : 0,
  };
};
