import axios from "axios";

const BASE_URL = "/api/Rooms";

export interface CreateRoomDto {
  name?: string | null;
  branchId: number;
}

export interface UpdateRoomDto {
  id: number;
  name?: string | null;
  branchId: number;
}

export interface RoomDto {
  id: number;
  name?: string | null;
  branchId: number;
  branchName?: string | null;
}

export interface RoomDtoPaginationResult {
  data?: RoomDto[] | null;
  total: number;
}

export const createRoom = async (data: CreateRoomDto): Promise<number> => {
  const res = await axios.post<number>(`${BASE_URL}`, data);
  return res.data;
};

export const deleteRoom = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const updateRoom = async (id: number, data: UpdateRoomDto): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, data);
};

export const getRoom = async (id: number): Promise<any> => {
  const res = await axios.get<RoomDto>(`${BASE_URL}/${id}`);
  return res.data;
};

export const restoreRoom = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/restore/${id}`);
};

export const getRoomsPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
  OnlyDeleted?: boolean;
}): Promise<RoomDtoPaginationResult> => {
  const res = await axios.get<RoomDtoPaginationResult>(`${BASE_URL}/pagination`, { params });
  const { data, total } = res.data || {};
  return {
    data: data ?? [],
    total: typeof total === "number" ? total : 0,
  };
};
