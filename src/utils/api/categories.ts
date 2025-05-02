import axios from "./axios";
import { API_BASE_URL } from "./constants";
const BASE_URL = `${API_BASE_URL}/Categories`;

export interface CreateCategoryDto {
  name?: string | null;
  description?: string | null;
}

export interface UpdateCategoryDto {
  id: number;
  name?: string | null;
  description?: string | null;
}

export interface CategoryDto {
  id: number;
  name?: string | null;
  description?: string | null;
}

export interface CategoryDtoPaginationResult {
  data?: CategoryDto[] | null;
  total: number;
}

export const createCategory = async (data: CreateCategoryDto): Promise<number> => {
  const token = localStorage.getItem("token");
  const res = await axios.post<number>(`${BASE_URL}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  const token = localStorage.getItem("token");
  await axios.delete(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateCategory = async (id: number, data: UpdateCategoryDto): Promise<void> => {
  const token = localStorage.getItem("token");
  await axios.put(`${BASE_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getCategory = async (id: number): Promise<any> => {
  const token = localStorage.getItem("token");
  const res = await axios.get<CategoryDto>(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const restoreCategory = async (id: number): Promise<void> => {
  const token = localStorage.getItem("token");
  await axios.put(`${BASE_URL}/restore/${id}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getCategoriesPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
  OnlyDeleted?: boolean;
}): Promise<CategoryDtoPaginationResult> => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get<CategoryDtoPaginationResult>(`${BASE_URL}/pagination`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    const { data, total } = res.data || {};
    return {
      data: Array.isArray(data) ? data : [],
      total: typeof total === "number" ? total : 0,
    };
  } catch (error) {
    return { data: [], total: 0 };
  }
};
