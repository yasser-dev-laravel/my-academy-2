import axios from "./axios";
import { API_BASE_URL } from "./constants";
const BASE_URL = `${API_BASE_URL}/Sessions`;


export interface CreateSessionDto {
  groupId: number;
  date: string; // date-time
  startTime: string; // time
  endTime: string; // time
  notes?: string | null;
}

export interface UpdateSessionDto {
  id: number;
  groupId: number;
  date: string; // date-time
  startTime: string; // time
  endTime: string; // time
  notes?: string | null;
}

export interface SessionDto {
  id: number;
  groupId: number;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string | null;
}

export interface SessionDtoPaginationResult {
  data?: SessionDto[] | null;
  total: number;
}

export const createSession = async (data: CreateSessionDto): Promise<number> => {
  const res = await axios.post<number>(`${BASE_URL}`, data);
  return res.data;
};

export const deleteSession = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const updateSession = async (id: number, data: UpdateSessionDto): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, data);
};

export const getSession = async (id: number): Promise<any> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const restoreSession = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/restore/${id}`);
};

export const getSessionsPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
  OnlyDeleted?: boolean;
}): Promise<SessionDtoPaginationResult> => {
  const res = await axios.get<SessionDtoPaginationResult>(`${BASE_URL}/pagination`, { params });
  const { data, total } = res.data || {};
  return {
    data: data ?? [],
    total: typeof total === "number" ? total : 0,
  };
};
