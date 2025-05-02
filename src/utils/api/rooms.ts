import axios from "./axios";
import { API_HelpTable_URL } from "./constants";
const API_HelpTable_URLL = `${API_BASE_URL}/Rooms`;
import { API_BASE_URL } from "./constants";
const BASE_URL = `${API_BASE_URL}/Rooms`;

export interface CreateRoomDto {
  name?: string | null;
  branchId: number;
  type: string;
  capacity: number;
}

export interface UpdateRoomDto {
  id: number;
  name?: string | null;
  branchId: number;
  type: string;
  capacity: number;
}

export interface RoomDto {
  id: number;
  name: string;
  type: string; // مثال: "معمل"
  capacity: number;
  branchId: number;
  branchName: string;
}

export interface RoomDtoPaginationResult {
  data?: RoomDto[] | null;
  total: number;
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const createRoom = async (data: CreateRoomDto): Promise<number> => {
  const res = await axios.post<number>(`${BASE_URL}`, data, { headers: getAuthHeaders() });
  return res.data;
};

export const deleteRoom = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeaders() });
};

export const updateRoom = async (id: number, data: UpdateRoomDto): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, data, { headers: getAuthHeaders() });
};

export const getRoom = async (id: number): Promise<any> => {
  const res = await axios.get<RoomDto>(`${BASE_URL}/${id}`, { headers: getAuthHeaders() });
  return res.data;
};

export const restoreRoom = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/restore/${id}`, {}, { headers: getAuthHeaders() });
};

export const getRoomsPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
  OnlyDeleted?: boolean;
}): Promise<RoomDtoPaginationResult> => {
  const res = await axios.get<RoomDtoPaginationResult>(`${BASE_URL}/pagination`, { params, headers: getAuthHeaders() });
  const { data, total } = res.data || {};
  return {
    data: data ?? [],
    total: typeof total === "number" ? total : 0,
  };
};
