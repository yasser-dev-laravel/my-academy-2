import axios from "@/utils/api/axios";

const BASE_URL = "/api/Branches";

export interface CreateBranchDto {
  name?: string | null;
  address?: string | null;
  areaId: number;
}

export interface UpdateBranchDto {
  id: number;
  name?: string | null;
  address?: string | null;
  areaId: number;
}

export interface BranchDto {
  id: number;
  name?: string | null;
  address?: string | null;
  areaId: number;
  areaName?: string | null;
  campaignsCount: number;
}

export interface BranchDtoPaginationResult {
  data?: BranchDto[] | null;
  total: number;
}

export const createBranch = async (data: CreateBranchDto): Promise<number> => {
  const res = await axios.post<number>(`${BASE_URL}`, data);
  return res.data;
};

export const deleteBranch = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const updateBranch = async (id: number, data: UpdateBranchDto): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, data);
};

export const getBranch = async (id: number): Promise<any> => {
  const res = await axios.get<BranchDto>(`${BASE_URL}/${id}`);
  return res.data;
};

export const restoreBranch = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/restore/${id}`);
};

export const getBranchesPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
  OnlyDeleted?: boolean;
}): Promise<BranchDtoPaginationResult> => {
  const res = await axios.get<BranchDtoPaginationResult>(`${BASE_URL}/pagination`, { params });
  const { data, total } = res.data || {};
  return {
    data: data ?? [],
    total: typeof total === "number" ? total : 0,
  };
};
