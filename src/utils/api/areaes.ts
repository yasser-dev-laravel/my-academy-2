import axios from "axios";

// CreateAreaDto type
export interface CreateAreaDto {
  name?: string | null;
  cityId: number;
}

// UpdateAreaDto type (تخمين بناءً على الشائع، عدل إذا كان لديك schema مختلف)
export interface UpdateAreaDto {
  id: number;
  name?: string | null;
  cityId: number;
}

// AreaDto type
export interface AreaDto {
  id: number;
  name?: string | null;
  cityId: number;
  cityName?: string | null;
}

// AreaDtoPaginationResult type
export interface AreaDtoPaginationResult {
  data?: AreaDto[] | null;
  total: number;
}

  // TODO: Fill according to your schema


const BASE_URL = "/api/Areaes";

export const createArea = async (data: CreateAreaDto): Promise<number> => {
  const res = await axios.post<number>(`${BASE_URL}`, data);
  return res.data;
};

export const deleteArea = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const updateArea = async (id: number, data: UpdateAreaDto): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, data);
};

export const getArea = async (id: number): Promise<any> => {
  const res = await axios.get<AreaDto>(`${BASE_URL}/${id}`);
  return res.data;
};

export const restoreArea = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/restore/${id}`);
};

export const getAreasPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
  OnlyDeleted?: boolean;
}): Promise<AreaDtoPaginationResult> => {
  const res = await axios.get<AreaDtoPaginationResult>(`${BASE_URL}/pagination`, { params });
  return res.data;
};
