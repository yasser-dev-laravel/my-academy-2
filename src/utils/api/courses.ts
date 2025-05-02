import axios from "@/utils/api/axios";

const BASE_URL = "/api/Courses";

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

export const createCourse = async (data: CreateCourseDto): Promise<number> => {
  const res = await axios.post<number>(`${BASE_URL}`, data);
  return res.data;
};

export const deleteCourse = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const updateCourse = async (id: number, data: UpdateCourseDto): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, data);
};

export const getCourse = async (id: number): Promise<any> => {
  const res = await axios.get<CourseDto>(`${BASE_URL}/${id}`);
  return res.data;
};

export const restoreCourse = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/restore/${id}`);
};

export const getCoursesPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
  OnlyDeleted?: boolean;
}): Promise<CourseDtoPaginationResult> => {
  const res = await axios.get<CourseDtoPaginationResult>(`${BASE_URL}/pagination`, { params });
  const { data, total } = res.data || {};
  return {
    data: data ?? [],
    total: typeof total === "number" ? total : 0,
  };
};
