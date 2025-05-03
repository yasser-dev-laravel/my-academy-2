import axios from "./axios";
import { API_BASE_URL } from "./constants";
const BASE_URL = `${API_BASE_URL}/Instructors`;

export interface CreateInstructorDto {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  nationalId: string;
  cityId: number;
  salary: number;
  salaryTypeId: number;
  coursesIds: number[];
}

export interface UpdateInstructorDto {
  id: number;
  name: string;
  email: string;
  password?: string | null;
  phone?: string | null;
  address?: string | null;
  paymentMethod: string;
  paymentAmount: number;
  courseIds: number[];
}

export interface InstructorDto {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  paymentMethod: string;
  paymentAmount: number;
  courseIds: number[];
}

export interface InstructorDtoPaginationResult {
  data?: InstructorDto[] | null;
  total: number;
}

export const createInstructor = async (data: CreateInstructorDto): Promise<number> => {
  const res = await axios.post<number>(`${BASE_URL}`, data);
  return res.data;
};

export const updateInstructor = async (id: number, data: UpdateInstructorDto): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, data);
};

export const deleteInstructor = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const getInstructor = async (id: number): Promise<InstructorDto> => {
  const res = await axios.get<InstructorDto>(`${BASE_URL}/${id}`);
  return res.data;
};

export const getInstructorsPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
  OnlyDeleted?: boolean;
}): Promise<InstructorDtoPaginationResult> => {
  const res = await axios.get<InstructorDtoPaginationResult>(`${BASE_URL}/pagination`, { params });
  return res.data;
};

export const restoreInstructor = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/restore/${id}`);
};
