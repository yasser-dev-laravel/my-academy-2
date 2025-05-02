import axios from "./axios";
import { API_BASE_URL } from "./constants";
const BASE_URL = `${API_BASE_URL}/Courses`;


export interface CreateCourseDto {
  name?: string | null;
  description?: string | null;
  categoryId: number;
  levels: number[];
}

export interface UpdateCourseDto {
  id: number;
  name?: string | null;
  description?: string | null;
  categoryId: number;
  levels: number[];
}

export interface CourseDto {
  id: number;
  name?: string | null;
  description?: string | null;
  categoryId: number;
  categoryName?: string | null;
  levels: number[];
}

export interface CourseDtoPaginationResult {
  data?: CourseDto[] | null;
  total: number;
}

export const getCoursesPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
}): Promise<any> => {
  const res = await axios.get(`${BASE_URL}/pagination`, { params });
  return res.data;
};

export const createCourse = async (data: any): Promise<any> => {
  const res = await axios.post(BASE_URL, data);
  return res.data;
};

export const updateCourse = async (id: number, data: any): Promise<any> => {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
};

export const deleteCourse = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};
