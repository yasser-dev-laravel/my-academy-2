import axios from "./axios";
import { API_BASE_URL } from "./constants";
import { getCoursesPaginated } from "./courses";

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
  console.log("Fetched instructors data:", res.data); // Log fetched data
  return res.data;
};

export const restoreInstructor = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/restore/${id}`);
};

export const getCities = async (): Promise<{ id: number; name: string }[]> => {
  const res = await axios.get<{ id: number; name: string }[]>(`${API_BASE_URL}/HelpTables/City`);
  return res.data;
};

export const getSalaryTypes = async (): Promise<{ id: number; type: string }[]> => {
  const res = await axios.get<{ id: number; type: string }[]>(`${API_BASE_URL}/HelpTables/SalaryType`);
  return res.data;
};

export const getCourses = async (): Promise<{ id: number; title: string }[]> => {
  const coursesRes = await getCoursesPaginated({ Page: 1, Limit: 100 });
  return coursesRes.data.map((course: any) => ({ id: course.id, title: course.name }));
};

export const getInstructorsByCourse = async (courseId: string): Promise<{ id: string; name: string }[]> => {
  const res = await axios.get<{ id: string; name: string }[]>(`${API_BASE_URL}/Instructors/by-course/${courseId}`);
  return res.data;
};
