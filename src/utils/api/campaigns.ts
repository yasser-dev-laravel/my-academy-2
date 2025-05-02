import axios from "axios";

const BASE_URL = "/api/Campaigns";

export interface CreateCampaignDto {
  name?: string | null;
  description?: string | null;
  startDate: string; // date-time
  endDate?: string | null; // date-time
  referenceId: string; // uuid
  branchesIds?: number[] | null;
  coursesIds?: number[] | null;
}

export interface UpdateCampaignDto {
  id: number;
  name?: string | null;
  description?: string | null;
  startDate: string; // date-time
  endDate?: string | null; // date-time
  referenceId: string; // uuid
  branchesIds?: number[] | null;
  coursesIds?: number[] | null;
}

export interface CampaignDto {
  id: number;
  name?: string | null;
  description?: string | null;
  startDate: string; // date-time
  endDate?: string | null; // date-time
  referenceId: string; // uuid
  leads?: any[] | null; // يمكنك استبدال any بـ LeadDto إذا كان معرفًا
  branchesIds?: number[] | null;
  branchesNames?: string[] | null;
  coursesIds?: number[] | null;
  coursesNames?: string[] | null;
}

export interface CampaignDtoPaginationResult {
  data?: CampaignDto[] | null;
  total: number;
}

export const createCampaign = async (data: CreateCampaignDto): Promise<number> => {
  const res = await axios.post<number>(`${BASE_URL}`, data);
  return res.data;
};

export const deleteCampaign = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const updateCampaign = async (id: number, data: UpdateCampaignDto): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, data);
};

export const getCampaign = async (id: number): Promise<any> => {
  const res = await axios.get<CampaignDto>(`${BASE_URL}/${id}`);
  return res.data;
};

export const restoreCampaign = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/restore/${id}`);
};

export const getCampaignsPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
  OnlyDeleted?: boolean;
}): Promise<CampaignDtoPaginationResult> => {
  const res = await axios.get<CampaignDtoPaginationResult>(`${BASE_URL}/pagination`, { params });
  const { data, total } = res.data || {};
  return {
    data: data ?? [],
    total: typeof total === "number" ? total : 0,
  };
};
