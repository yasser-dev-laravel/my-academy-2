import axios from "@/utils/api/axios";

const BASE_URL = "/api/Categories";

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
  const res = await axios.post<number>(`${BASE_URL}`, data);
  return res.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const updateCategory = async (id: number, data: UpdateCategoryDto): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, data);
};

export const getCategory = async (id: number): Promise<any> => {
  const res = await axios.get<CategoryDto>(`${BASE_URL}/${id}`);
  return res.data;
};

export const restoreCategory = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/restore/${id}`);
};

export const getCategoriesPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
  OnlyDeleted?: boolean;
}): Promise<CategoryDtoPaginationResult> => {
  try {
    const res = await axios.get<CategoryDtoPaginationResult>(`${BASE_URL}/pagination`, { params });
    const { data, total } = res.data || {};
    return {
      data: Array.isArray(data) ? data : [],
      total: typeof total === "number" ? total : 0,
    };
  } catch (error) {
    // في حال حدوث خطأ، أعد مصفوفة فارغة وعدد 0
    return { data: [], total: 0 };
  }
};
