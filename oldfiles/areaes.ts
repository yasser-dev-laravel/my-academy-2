import axios from "./axios";
import { API_BASE_URL } from "./constants";

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

const BASE_URL = `${API_BASE_URL}/Areaes`;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const createArea = async (data: CreateAreaDto): Promise<number> => {
  const res = await axios.post<number>(`${BASE_URL}`, data, { headers: getAuthHeaders() });
  return res.data;
};

export const deleteArea = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeaders() });
};

export const updateArea = async (id: number, data: UpdateAreaDto): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, data, { headers: getAuthHeaders() });
};

export const getArea = async (id: number): Promise<any> => {
  const res = await axios.get<AreaDto>(`${BASE_URL}/${id}`, { headers: getAuthHeaders() });
  return res.data;
};

export const restoreArea = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/restore/${id}`, {}, { headers: getAuthHeaders() });
};

export const getAreasPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
  OnlyDeleted?: boolean;
}): Promise<AreaDtoPaginationResult> => {
  const res = await axios.get<AreaDtoPaginationResult>(`${BASE_URL}/pagination`, { params, headers: getAuthHeaders() });
  return res.data;
};
