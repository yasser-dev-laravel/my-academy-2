import axios from "./axios";
import { API_BASE_URL } from "./constants";
const BASE_URL = `${API_BASE_URL}/L`;

export interface CreateLeadDto {
  name: string;
  phone: string;
  campaignId?: number | null;
  statusId?: number | null;
  sourceId?: number | null;
  assignedToId?: number | null;
  notes?: string | null;
}

export interface UpdateLeadDto {
  id: number;
  name: string;
  phone: string;
  campaignId?: number | null;
  statusId?: number | null;
  sourceId?: number | null;
  assignedToId?: number | null;
  notes?: string | null;
}

export interface LeadDto {
  id: number;
  name: string;
  phone: string;
  campaignId?: number | null;
  statusId?: number | null;
  sourceId?: number | null;
  assignedToId?: number | null;
  notes?: string | null;
}

export interface LeadDtoPaginationResult {
  data?: LeadDto[] | null;
  total: number;
}

export const createLead = async (data: CreateLeadDto): Promise<number> => {
  const res = await axios.post<number>(`${BASE_URL}`, data);
  return res.data;
};

export const deleteLead = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const updateLead = async (id: number, data: UpdateLeadDto): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, data);
};

export const getLead = async (id: number): Promise<any> => {
  const res = await axios.get<LeadDto>(`${BASE_URL}/${id}`);
  return res.data;
};

export const restoreLead = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/restore/${id}`);
};

export const getLeadsPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
  OnlyDeleted?: boolean;
}): Promise<LeadDtoPaginationResult> => {
  const res = await axios.get<LeadDtoPaginationResult>(`${BASE_URL}/pagination`, { params });
  const { data, total } = res.data || {};
  return {
    data: data ?? [],
    total: typeof total === "number" ? total : 0,
  };
};
