import axios from "./axios";
import { API_BASE_URL } from "./constants";

const BASE_URL = `${API_BASE_URL}/Cityes`;

export interface CreateCityDto {
  name?: string | null;
}

export interface UpdateCityDto {
  id: number;
  name?: string | null;
}

export interface CityDto {
  id: number;
  name?: string | null;
}

export interface CitiesPaginationResult {
  data?: CityDto[] | null;
  total: number;
}

export const createCity = async (data: CreateCityDto): Promise<number> => {
  const res = await axios.post<number>(`${BASE_URL}`, data);
  return res.data;
};

export const deleteCity = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const updateCity = async (id: number, data: UpdateCityDto): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, data);
};

export const getCity = async (id: number): Promise<any> => {
  const res = await axios.get<CityDto>(`${BASE_URL}/${id}`);
  return res.data;
};

export const restoreCity = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/restore/${id}`);
};

export const getCitiesPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
  OnlyDeleted?: boolean;
}): Promise<CitiesPaginationResult> => {
  const res = await axios.get<CitiesPaginationResult>(`${BASE_URL}/pagination`, { params });
  const { data, total } = res.data || {};
  return {
    data: data ?? [],
    total: typeof total === "number" ? total : 0,
  };
};
