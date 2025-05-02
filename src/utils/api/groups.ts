import axios from "axios";

const BASE_URL = "/api/Groups";

export interface CreateGroupDto {
  name: string;
  startDate?: string | null; // date-time
  endDate?: string | null; // date-time
  startTime: string; // time
  endTime: string; // time
  instructorId: number;
  levelId: number;
  roomId: number;
  statusId: number;
  studentIds?: number[] | null;
  days?: number[] | null;
}

export interface UpdateGroupDto {
  id: number;
  name: string;
  startDate?: string | null; // date-time
  endDate?: string | null; // date-time
  startTime: string; // time
  endTime: string; // time
  instructorId: number;
  levelId: number;
  roomId: number;
  statusId: number;
  studentIds?: number[] | null;
  days?: number[] | null;
}

export interface GroupDto {
  id: number;
  name: string;
  startDate?: string | null;
  endDate?: string | null;
  startTime: string;
  endTime: string;
  instructorId: number;
  levelId: number;
  roomId: number;
  statusId: number;
  studentIds?: number[] | null;
  days?: number[] | null;
}

export interface GroupDtoPaginationResult {
  data?: GroupDto[] | null;
  total: number;
}

export const createGroup = async (data: CreateGroupDto): Promise<number> => {
  const res = await axios.post<number>(`${BASE_URL}`, data);
  return res.data;
};

export const deleteGroup = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const updateGroup = async (id: number, data: UpdateGroupDto): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, data);
};

export const getGroup = async (id: number): Promise<any> => {
  const res = await axios.get<GroupDto>(`${BASE_URL}/${id}`);
  return res.data;
};

export const restoreGroup = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/restore/${id}`);
};

export const getGroupsPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
  OnlyDeleted?: boolean;
}): Promise<GroupDtoPaginationResult> => {
  const res = await axios.get<GroupDtoPaginationResult>(`${BASE_URL}/pagination`, { params });
  const { data, total } = res.data || {};
  return {
    data: data ?? [],
    total: typeof total === "number" ? total : 0,
  };
};
