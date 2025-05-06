// ملف API مجمع - تم إنشاؤه تلقائيًا
// يوفر دوال موحدة للتعامل مع جميع APIs في النظام
// يعتمد على axios وواجهات types.ts

import axios from './axios';
import { UserDto, LoginResponse } from './types';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_HelpTable_URL = import.meta.env.VITE_API_HelpTable_URL;


// ملف API موحد - استخدم الدوال العامة التالية لكل الكيانات
// ------------------------------------------------------
// apiGet<T>(endpoint: string, params?: any): Promise<T>
// apiPost<T>(endpoint: string, data: any): Promise<T>
// apiPut<T>(endpoint: string, data: any): Promise<T>
// apiDelete<T>(endpoint: string): Promise<T>
// ------------------------------------------------------
// مثال للاستخدام:
// const result = await apiGet<AreaDtoPaginationResult>('Areas/pagination', { Page: 1, Limit: 20 });
// const id = await apiPost<number>('Areas', areaData);
// await apiPut<void>(`Areas/${id}`, areaData);
// await apiDelete<void>(`Areas/${id}`);
// ------------------------------------------------------

// يمكنك كتابة دوال خاصة فقط للعمليات غير النمطية (مثل loginUser)



// دوال تسجيل الدخول وجلب المستخدم
// Define a standard API response type
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}


export const getUser = async (
  id: number
): Promise<ApiResponse<UserDto>> => {
  try {
    const res = await axios.get<UserDto>(`${API_BASE_URL}/Users/${id}`);
    return { data: res.data };
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message || "Unknown error" };
  }
};






// ========== دوال موحدة للتعامل مع API ==========
export const apiGet = async <T>(endpoint: string, params?: any): Promise<T> => {
  const res = await axios.get<T>(`${API_BASE_URL}/${endpoint}`, { params });
  return res.data;
};



export const apiPost = async <T>(endpoint: string, data: any): Promise<T> => {
  const res = await axios.post<T>(`${API_BASE_URL}/${endpoint}`, data);
  return res.data;
};



export const apiPut = async <T>(endpoint: string, data: any): Promise<T> => {
  const res = await axios.put<T>(`${API_BASE_URL}/${endpoint}`, data);
  return res.data;
};



export const apiDelete = async <T>(endpoint: string): Promise<T> => {
  const res = await axios.delete<T>(`${API_BASE_URL}/${endpoint}`);
  return res.data;
};













// ========== Auth APIs ==========
/**
 * تسجيل الدخول (Login)
 * لا يرسل التوكن مع هذا الطلب
 */
export const loginUser = async (
  userNameOrEmail: string,
  password: string
): Promise<ApiResponse<LoginResponse>> => {
  try {
    // لا ترسل أي توكن أو هيدر إضافي مع طلب تسجيل الدخول
    const res = await axios.post<LoginResponse>(
      `${API_BASE_URL}/Auth/login`,
      { userNameOrEmail, password },
      { headers: {} }
    );
    console.log('API Login response:', res.data); // Debug log
    return { data: res.data };
  } catch (error: any) {
    return { error: error.response?.data?.message || error.message || "Unknown error" };
  }
};



















  

  


    




















 

















 









 



 



 


 



 



   const res = await axios.post<number>(`${API_BASE_URL}/Courses`, data);



   await axios.put(`${API_BASE_URL}/Courses/${id}`, data);


   await axios.delete(`${API_BASE_URL}/Courses/${id}`);


// ========== Lead APIs ==========
   const res = await axios.get<LeadDtoPaginationResult>(`${API_BASE_URL}/Leads/pagination`, { params });



   const res = await axios.post<number>(`${API_BASE_URL}/Leads`, data);



   await axios.put(`${API_BASE_URL}/Leads/${id}`, data);


   await axios.delete(`${API_BASE_URL}/Leads/${id}`);


// ========== Employee APIs ==========
   const res = await axios.get<EmployeeDtoPaginationResult>(`${API_BASE_URL}/Employees/pagination`, { params });



   const res = await axios.post<number>(`${API_BASE_URL}/Employees`, data);



   await axios.put(`${API_BASE_URL}/Employees/${id}`, data);


   await axios.delete(`${API_BASE_URL}/Employees/${id}`);


// ========== User APIs ==========
   const res = await axios.get<UserDtoPaginationResult>(`${API_BASE_URL}/Users/pagination`, { params });



 = async (data: CreateUserDto): Promise<number> =>   const res = await axios.post<number>(`${API_BASE_URL}/Users`, data);



 = async (id: number, data: UpdateUserDto): Promise<void> =>   await axios.put(`${API_BASE_URL}/Users/${id}`, data);


   await axios.delete(`${API_BASE_URL}/Users/${id}`);


// ========== Role APIs ==========
 = async (params: any): Promise<RoleDtoPaginationResult> =>   const res = await axios.get<RoleDtoPaginationResult>(`${API_BASE_URL}/Roles/pagination`, { params });



 = async (data: CreateRoleDto): Promise<number> =>   const res = await axios.post<number>(`${API_BASE_URL}/Roles`, data);



 = async (id: number, data: UpdateRoleDto): Promise<void> =>   await axios.put(`${API_BASE_URL}/Roles/${id}`, data);


   await axios.delete(`${API_BASE_URL}/Roles/${id}`);


// ========== Educational Qualification Type APIs ==========
export const getEducationalQualificationTypesPaginated = async (params: any): Promise<EducationalQualificationTypeDtoPaginationResult> =>   const res = await axios.get<EducationalQualificationTypeDtoPaginationResult>(`${API_BASE_URL}/EducationalQualificationType/pagination`, { params });



export const createEducationalQualificationType = async (data: CreateEducationalQualificationTypeDto): Promise<number> =>   const res = await axios.post<number>(`${API_BASE_URL}/EducationalQualificationType`, data);



export const updateEducationalQualificationType = async (id: number, data: UpdateEducationalQualificationTypeDto): Promise<void> =>   await axios.put(`${API_BASE_URL}/EducationalQualificationType/${id}`, data);


export const deleteEducationalQualificationType   await axios.delete(`${API_BASE_URL}/EducationalQualificationType/${id}`);


// ========== Educational Qualification Issuer APIs ==========
export const getEducationalQualificationIssuersPaginated = async (params: any): Promise<EducationalQualificationIssuerDtoPaginationResult> =>   const res = await axios.get<EducationalQualificationIssuerDtoPaginationResult>(`${API_BASE_URL}/EducationalQualificationIssuer/pagination`, { params });



export const createEducationalQualificationIssuer = async (data: CreateEducationalQualificationIssuerDto): Promise<number> =>   const res = await axios.post<number>(`${API_BASE_URL}/EducationalQualificationIssuer`, data);



export const updateEducationalQualificationIssuer = async (id: number, data: UpdateEducationalQualificationIssuerDto): Promise<void> =>   await axios.put(`${API_BASE_URL}/EducationalQualificationIssuer/${id}`, data);


export const deleteEducationalQualificationIssuer   await axios.delete(`${API_BASE_URL}/EducationalQualificationIssuer/${id}`);


// ========== Educational Qualification Description APIs ==========
export const getEducationalQualificationDescriptionsPaginated = async (params: any): Promise<EducationalQualificationDescriptionDtoPaginationResult> =>   const res = await axios.get<EducationalQualificationDescriptionDtoPaginationResult>(`${API_BASE_URL}/EducationalQualificationDescription/pagination`, { params });



export const createEducationalQualificationDescription = async (data: CreateEducationalQualificationDescriptionDto): Promise<number> =>   const res = await axios.post<number>(`${API_BASE_URL}/EducationalQualificationDescription`, data);



export const updateEducationalQualificationDescription = async (id: number, data: UpdateEducationalQualificationDescriptionDto): Promise<void> =>   await axios.put(`${API_BASE_URL}/EducationalQualificationDescription/${id}`, data);


export const deleteEducationalQualificationDescription   await axios.delete(`${API_BASE_URL}/EducationalQualificationDescription/${id}`);


// ========== HelpTables APIs ==========
export const getHelpTableAreas = async (): Promise<any[]> =>   const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/Area`);



export const getHelpTableBranches = async (): Promise<any[]> =>   const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/Branch`);



export const getHelpTableCategories = async (): Promise<any[]> =>   const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/Category`);



export const getHelpTableCities = async (): Promise<any[]> =>   const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/City`);



export const getHelpTableEducationalQualificationDescriptions = async (): Promise<any[]> =>   const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/EducationalQualificationDescription`);



export const getHelpTableEducationalQualificationIssuers = async (): Promise<any[]> =>   const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/EducationalQualificationIssuer`);



export const getHelpTableEducationalQualificationTypes = async (): Promise<any[]> =>   const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/EducationalQualificationType`);



export const getHelpTableGroupDays = async (): Promise<any[]> =>   const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/GroupDays`);



export const getHelpTableGroupStatus = async (): Promise<any[]> =>   const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/GroupStatus`);



export const getHelpTablePermissions = async (): Promise<any[]> =>   const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/Permission`);



export const getHelpTableRoom = async (): Promise<any[]> =>   const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/Room`);



export const getHelpTableRoomTypes = async (): Promise<any[]> =>   const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/RoomType`);



export const getHelpTableSalaryTypes = async (): Promise<any[]> =>   const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/SalaryType`);



export const getHelpTableStudentFlowSteps = async (): Promise<any[]> =>   const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/StudentFlowStep`);



// يمكنك إضافة المزيد من الدوال بنفس النمط حسب الحاجة

// ========== Student APIs ==========
export const createStudent = async (data: any): Promise<number> =>   const res = await axios.post<number>(`${API_BASE_URL}/Students`, data);



// ===================== إيصالات الدفع (Payments) من localStorage =====================

// Payment interface (only add if not already imported from types)
export interface Payment   id: string;
  studentId: string;
  groupId: string;
  amount: number;
  date: string;
  status: string;
  note?: string;
}

const RECEIPT_STORAGE_KEY = 'latin_academy_receipts';

function getFromLocalStorage<T>(key: string, defaultValue: T): T   if (typeof window === 'undefined') return defaultValue;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
}

// استرجاع جميع الإيصالات
export const getReceipts = async (): Promise<Payment[]> =>   return getFromLocalStorage<Payment[]>(RECEIPT_STORAGE_KEY, []);


// إضافة إيصال جديد
export const addReceipt = async (receipt: Payment): Promise<void> =>   const receipts = await getReceipts();
  receipts.push(receipt);
  localStorage.setItem(RECEIPT_STORAGE_KEY, JSON.stringify(receipts));


// تحديث إيصال
export const updateReceipt = async (receipt: Payment): Promise<void> =>   let receipts = await getReceipts();
  receipts = receipts.map(r => r.id === receipt.id ? receipt : r);
  localStorage.setItem(RECEIPT_STORAGE_KEY, JSON.stringify(receipts));


// حذف إيصال
export const deleteReceipt = async (id: string): Promise<void> =>   let receipts = await getReceipts();
  receipts = receipts.filter(r => r.id !== id);
  localStorage.setItem(RECEIPT_STORAGE_KEY, JSON.stringify(receipts));


// تصفية الإيصالات حسب الطالب أو المجموعة أو الفترة
export const filterReceipts = async (filters:   studentId?: string;
  groupId?: string;
  fromDate?: string;
  toDate?: string;
}): Promise<Payment[]> =>   let receipts = await getReceipts();
  if (filters.studentId) receipts = receipts.filter(r => r.studentId === filters.studentId);
  if (filters.groupId) receipts = receipts.filter(r => r.groupId === filters.groupId);
  if (filters.fromDate) receipts = receipts.filter(r => r.date >= filters.fromDate);
  if (filters.toDate) receipts = receipts.filter(r => r.date <= filters.toDate);
  return receipts;

