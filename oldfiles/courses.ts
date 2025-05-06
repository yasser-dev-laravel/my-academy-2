import axios from "./axios";
import { API_BASE_URL } from "./constants";
const BASE_URL = `${API_BASE_URL}/Courses`;

export interface LevelDto {
  id: number | null;
  name: string;
  description: string;
  price: number | null;
  sessionsCount: number | null;
}

export interface CreateCourseDto {
  name?: string | null;
  description?: string | null;
  categoryId: number;
  isActive?: boolean;
  levels: LevelDto[]; // Updated to include full level details
}

export interface UpdateCourseDto {
  id: number;
  name?: string | null;
  description?: string | null;
  categoryId: number;
  isActive?: boolean;
  levels: LevelDto[]; // Updated to include full level details
}

// export interface CourseDto {
//   id: number;
//   name?: string | null;
//   description?: string | null;
//   categoryId: number;
//   isActive?: boolean;
//   categoryName?: string | null;
//   levels: number[];
// }

export interface CourseDtoPaginationResult {
  data?: CreateCourseDto[] | null;
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
  try {
    console.log("[CREATE COURSE] Payload:", JSON.stringify(data, null, 2)); // Log the payload being sent
    const res = await axios.post(BASE_URL, data);
    console.log("[CREATE COURSE] Response:", JSON.stringify(res.data, null, 2)); // Log the response
    return res.data;
  } catch (error) {
    console.error("[CREATE COURSE] Error:", error.response?.data || error.message); // Log the error
    throw error;
  }
};

export const updateCourse = async (id: number, data: any): Promise<any> => {
  try {
    console.log("[UPDATE COURSE] Route ID:", id); // Log the route ID
    console.log("[UPDATE COURSE] Payload:", JSON.stringify(data, null, 2)); // Log the payload being sent
    const res = await axios.put(`${BASE_URL}/${id}`, data);
    console.log("[UPDATE COURSE] Response:", JSON.stringify(res.data, null, 2)); // Log the response
    return res.data;
  } catch (error) {
    console.error("[UPDATE COURSE] Error Response:", error.response?.data || error.message); // Log the error response
    throw error;
  }
};

export const deleteCourse = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};
