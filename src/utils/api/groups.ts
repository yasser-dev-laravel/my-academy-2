import axios from './axios';

const BASE_URL = 'Groups';

// استخدم endpoint pagination لجلب كل المجموعات
export const getGroups = async () => {
  const response = await axios.get(`${BASE_URL}/pagination`, {
    params: { Page: 1, Limit: 1000 }
  });
  // أعد فقط مصفوفة المجموعات
  return response.data.data || [];
};

export const addGroup = async (groupData: any) => {
  const response = await axios.post(`${BASE_URL}`, groupData);
  return response.data;
};

export const updateGroup = async (id: string, groupData: any) => {
  const response = await axios.put(`${BASE_URL}/${id}`, groupData);
  return response.data;
};

export const deleteGroup = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
