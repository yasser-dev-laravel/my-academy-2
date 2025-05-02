import axios from "axios";

const BASE_URL = "/api/MessageTemplates";

export interface CreateMessageTemplateDto {
  name?: string | null;
  sendAutomatically: boolean;
  body?: string | null;
  trigger: string; // StudentFlowStep - نوع خاص
}

export interface UpdateMessageTemplateDto {
  id: number;
  name?: string | null;
  sendAutomatically: boolean;
  body?: string | null;
  trigger: string; // StudentFlowStep - نوع خاص
}

export interface MessageTemplateDto {
  id: number;
  name?: string | null;
  sendAutomatically: boolean;
  body?: string | null;
  trigger: string; // StudentFlowStep - نوع خاص
}

export interface MessageTemplateDtoPaginationResult {
  data?: MessageTemplateDto[] | null;
  total: number;
}

export const createMessageTemplate = async (data: CreateMessageTemplateDto): Promise<number> => {
  const res = await axios.post<number>(`${BASE_URL}`, data);
  return res.data;
};

export const deleteMessageTemplate = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};

export const updateMessageTemplate = async (id: number, data: UpdateMessageTemplateDto): Promise<void> => {
  await axios.put(`${BASE_URL}/${id}`, data);
};

export const getMessageTemplate = async (id: number): Promise<any> => {
  const res = await axios.get<MessageTemplateDto>(`${BASE_URL}/${id}`);
  return res.data;
};

export const restoreMessageTemplate = async (id: number): Promise<void> => {
  await axios.put(`${BASE_URL}/restore/${id}`);
};

export const getMessageTemplatesPaginated = async (params: {
  Page?: number;
  Limit?: number;
  SortField?: string;
  IsDesc?: boolean;
  FreeText?: string;
  OnlyDeleted?: boolean;
}): Promise<MessageTemplateDtoPaginationResult> => {
  const res = await axios.get<MessageTemplateDtoPaginationResult>(`${BASE_URL}/pagination`, { params });
  const { data, total } = res.data || {};
  return {
    data: data ?? [],
    total: typeof total === "number" ? total : 0,
  };
};
