// ملف API مجمع - تم إنشاؤه تلقائيًا
// يوفر دوال موحدة للتعامل مع جميع APIs في النظام
// يعتمد على axios وواجهات types.ts

import axios from './axios';
import {
  AreaDto, AreaDtoPaginationResult, CreateAreaDto,
  BranchDto, BranchDtoPaginationResult, CreateBranchDto,
  CampaignDto, CampaignDtoPaginationResult, CreateCampaignDto,
  CategoryDto, CategoryDtoPaginationResult, CreateCategoryDto,
  CityDto, CityDtoPaginationResult, CreateCityDto,
  CourseDto, CourseDtoPaginationResult, CreateCourseDto,
  LevelDto, CreateLevelDto,
  LeadDto, LeadDtoPaginationResult, CreateLeadDto,
  EmployeeDto, EmployeeDtoPaginationResult, CreateEmployeeDto, UpdateEmployeeDto,
  UserDto, UserDtoPaginationResult, CreateUserDto, UpdateUserDto,
  RoleDto, RoleDtoPaginationResult, CreateRoleDto, UpdateRoleDto,
  RoomDto, RoomDtoPaginationResult, CreateRoomDto, UpdateRoomDto,
  Group,
  EducationalQualificationTypeDto, EducationalQualificationTypeDtoPaginationResult, CreateEducationalQualificationTypeDto, UpdateEducationalQualificationTypeDto,
  EducationalQualificationIssuerDto, EducationalQualificationIssuerDtoPaginationResult, CreateEducationalQualificationIssuerDto, UpdateEducationalQualificationIssuerDto,
  EducationalQualificationDescriptionDto, EducationalQualificationDescriptionDtoPaginationResult, CreateEducationalQualificationDescriptionDto, UpdateEducationalQualificationDescriptionDto,
  LoginResponse
} from './types';

// ========== Room APIs ==========
export const getRoomsPaginated = async (params: any): Promise<RoomDtoPaginationResult> => {
  const res = await axios.get<RoomDtoPaginationResult>(`${API_BASE_URL}/Rooms/pagination`, { params });
  return res.data;
};

export const createRoom = async (data: CreateRoomDto): Promise<number> => {
  const res = await axios.post<number>(`${API_BASE_URL}/Rooms`, data);
  return res.data;
};

export const updateRoom = async (id: number, data: UpdateRoomDto): Promise<void> => {
  await axios.put(`${API_BASE_URL}/Rooms/${id}`, data);
};

export const deleteRoom = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/Rooms/${id}`);
};

// ========== Group APIs ==========
export const getGroups = async (): Promise<Group[]> => {
  const response = await axios.get<{ data: Group[] }>(`${API_BASE_URL}/Groups/pagination`, {
    params: { Page: 1, Limit: 1000 }
  });
  return response.data.data || [];
};

export const addGroup = async (groupData: Partial<Group>) => {
  const response = await axios.post(`${API_BASE_URL}/Groups`, groupData);
  return response.data;
};

export const updateGroup = async (id: number, groupData: Partial<Group>) => {
  const response = await axios.put(`${API_BASE_URL}/Groups/${id}`, groupData);
  return response.data;
};

export const deleteGroup = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/Groups/${id}`);
  return response.data;
};

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

// ========== Instructor APIs ==========

import type { InstructorDto, InstructorDtoPaginationResult } from './types';

export const getInstructorsPaginated = async (params: any): Promise<InstructorDtoPaginationResult> => {
  const res = await axios.get<InstructorDtoPaginationResult>(`${API_BASE_URL}/Instructors/pagination`, { params });
  return res.data;
};

export const createInstructor = async (data: any): Promise<number> => {
  const res = await axios.post<number>(`${API_BASE_URL}/Instructors`, data);
  return res.data;
};

export const updateInstructor = async (id: number, data: any): Promise<void> => {
  await axios.put(`${API_BASE_URL}/Instructors/${id}`, data);
};

export const deleteInstructor = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/Instructors/${id}`);
};

export const restoreInstructor = async (id: number): Promise<void> => {
  await axios.put(`${API_BASE_URL}/Instructors/restore/${id}`);
};

export const getInstructorById = async (id: number): Promise<InstructorDto> => {
  const res = await axios.get<InstructorDto>(`${API_BASE_URL}/Instructors/${id}`);
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

// يمكنك إضافة المزيد من الدوال حسب الحاجة

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ========== Area APIs ==========
export const getAreas = async (): Promise<AreaDto[]> => {
  const res = await axios.get<{ data: AreaDto[] }>(`${API_BASE_URL}/Areas`);
  return res.data.data || [];
};
export const getAreasPaginated = async (params: any): Promise<AreaDto> => {
  const res = await axios.get<AreaDto>(`${API_BASE_URL}/Areas/pagination`, { params });
  return res.data;
};

export const createArea = async (data: CreateAreaDto): Promise<number> => {
  try {
    // المحاولة الأولى: /Areas
    const res = await axios.post<number>(`${API_BASE_URL}/Areas`, data);
    return res.data;
  } catch (err1) {
    try {
      // المحاولة الثانية: /areas
      const res = await axios.post<number>(`${API_BASE_URL}/areas`, data);
      return res.data;
    } catch (err2) {
      // المحاولة الثالثة: /Areaes (أخطاء شائعة)
      const res = await axios.post<number>(`${API_BASE_URL}/Areaes`, data);
      return res.data;
    }
  }
};

export const updateArea = async (id: number, data: UpdateAreaDto): Promise<void> => {
  await axios.put(`${API_BASE_URL}/Areaes/${id}`, data);
};

export const deleteArea = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/Areaes/${id}`);
};

// ========== Branch APIs ==========
export const getBranchesPaginated = async (params: any): Promise<BranchDtoPaginationResult> => {
  const res = await axios.get<BranchDtoPaginationResult>(`${API_BASE_URL}/Branches/pagination`, { params });
  return res.data;
};

export const createBranch = async (data: CreateBranchDto): Promise<number> => {
  const res = await axios.post<number>(`${API_BASE_URL}/Branches`, data);
  return res.data;
};

export const updateBranch = async (id: number, data: UpdateBranchDto): Promise<void> => {
  await axios.put(`${API_BASE_URL}/Branches/${id}`, data);
};

export const deleteBranch = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/Branches/${id}`);
};

// ========== Campaign APIs ==========
export const getCampaignsPaginated = async (params: any): Promise<CampaignDtoPaginationResult> => {
  const res = await axios.get<CampaignDtoPaginationResult>(`${API_BASE_URL}/Campaigns/pagination`, { params });
  return res.data;
};

export const createCampaign = async (data: CreateCampaignDto): Promise<number> => {
  const res = await axios.post<number>(`${API_BASE_URL}/Campaigns`, data);
  return res.data;
};

export const updateCampaign = async (id: number, data: UpdateCampaignDto): Promise<void> => {
  await axios.put(`${API_BASE_URL}/Campaigns/${id}`, data);
};

export const deleteCampaign = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/Campaigns/${id}`);
};

// ========== Category APIs ==========
export const getCategoriesPaginated = async (params: any): Promise<CategoryDtoPaginationResult> => {
  const res = await axios.get<CategoryDtoPaginationResult>(`${API_BASE_URL}/Categories/pagination`, { params });
  return res.data;
};

export const createCategory = async (data: CreateCategoryDto): Promise<number> => {
  const res = await axios.post<number>(`${API_BASE_URL}/Categories`, data);
  return res.data;
};

export const updateCategory = async (id: number, data: UpdateCategoryDto): Promise<void> => {
  await axios.put(`${API_BASE_URL}/Categories/${id}`, data);
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/Categories/${id}`);
};

// ========== City APIs ==========
export const getCities = async (): Promise<CityDto[]> => {
  const res = await axios.get(`${API_BASE_URL}/Cityes/pagination`);
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.data?.data)) return res.data.data;
  return [];
};
export const getCitiesPaginated = async (params: any): Promise<CityDtoPaginationResult> => {
  const res = await axios.get<CityDtoPaginationResult>(`${API_BASE_URL}/Cityes/pagination`, { params });
  return res.data;
};

export const createCity = async (data: CreateCityDto): Promise<number> => {
  const res = await axios.post<number>(`${API_BASE_URL}/Cityes`, data);
  return res.data;
};

export const updateCity = async (id: number, data: UpdateCityDto): Promise<void> => {
  await axios.put(`${API_BASE_URL}/Cityes/${id}`, data);
};

export const deleteCity = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/Cityes/${id}`);
};

// ========== Course APIs ==========
export const getCoursesPaginated = async (params: any): Promise<CourseDtoPaginationResult> => {
  const res = await axios.get<CourseDtoPaginationResult>(`${API_BASE_URL}/Courses/pagination`, { params });
  return res.data;
};

export const createCourse = async (data: CreateCourseDto): Promise<number> => {
  const res = await axios.post<number>(`${API_BASE_URL}/Courses`, data);
  return res.data;
};

export const updateCourse = async (id: number, data: UpdateCourseDto): Promise<void> => {
  await axios.put(`${API_BASE_URL}/Courses/${id}`, data);
};

export const deleteCourse = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/Courses/${id}`);
};

// ========== Lead APIs ==========
export const getLeadsPaginated = async (params: any): Promise<LeadDtoPaginationResult> => {
  const res = await axios.get<LeadDtoPaginationResult>(`${API_BASE_URL}/Leads/pagination`, { params });
  return res.data;
};

export const createLead = async (data: CreateLeadDto): Promise<number> => {
  const res = await axios.post<number>(`${API_BASE_URL}/Leads`, data);
  return res.data;
};

export const updateLead = async (id: number, data: CreateLeadDto): Promise<void> => {
  await axios.put(`${API_BASE_URL}/Leads/${id}`, data);
};

export const deleteLead = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/Leads/${id}`);
};

// ========== Employee APIs ==========
export const getEmployeesPaginated = async (params: any): Promise<EmployeeDtoPaginationResult> => {
  const res = await axios.get<EmployeeDtoPaginationResult>(`${API_BASE_URL}/Employees/pagination`, { params });
  return res.data;
};

export const createEmployee = async (data: CreateEmployeeDto): Promise<number> => {
  const res = await axios.post<number>(`${API_BASE_URL}/Employees`, data);
  return res.data;
};

export const updateEmployee = async (id: number, data: UpdateEmployeeDto): Promise<void> => {
  await axios.put(`${API_BASE_URL}/Employees/${id}`, data);
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/Employees/${id}`);
};

// ========== User APIs ==========
export const getUsersPaginated = async (params: any): Promise<UserDtoPaginationResult> => {
  const res = await axios.get<UserDtoPaginationResult>(`${API_BASE_URL}/Users/pagination`, { params });
  return res.data;
};

export const createUser = async (data: CreateUserDto): Promise<number> => {
  const res = await axios.post<number>(`${API_BASE_URL}/Users`, data);
  return res.data;
};

export const updateUser = async (id: number, data: UpdateUserDto): Promise<void> => {
  await axios.put(`${API_BASE_URL}/Users/${id}`, data);
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/Users/${id}`);
};

// ========== Role APIs ==========
export const getRolesPaginated = async (params: any): Promise<RoleDtoPaginationResult> => {
  const res = await axios.get<RoleDtoPaginationResult>(`${API_BASE_URL}/Roles/pagination`, { params });
  return res.data;
};

export const createRole = async (data: CreateRoleDto): Promise<number> => {
  const res = await axios.post<number>(`${API_BASE_URL}/Roles`, data);
  return res.data;
};

export const updateRole = async (id: number, data: UpdateRoleDto): Promise<void> => {
  await axios.put(`${API_BASE_URL}/Roles/${id}`, data);
};

export const deleteRole = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/Roles/${id}`);
};

// ========== Educational Qualification Type APIs ==========
export const getEducationalQualificationTypesPaginated = async (params: any): Promise<EducationalQualificationTypeDtoPaginationResult> => {
  const res = await axios.get<EducationalQualificationTypeDtoPaginationResult>(`${API_BASE_URL}/EducationalQualificationType/pagination`, { params });
  return res.data;
};

export const createEducationalQualificationType = async (data: CreateEducationalQualificationTypeDto): Promise<number> => {
  const res = await axios.post<number>(`${API_BASE_URL}/EducationalQualificationType`, data);
  return res.data;
};

export const updateEducationalQualificationType = async (id: number, data: UpdateEducationalQualificationTypeDto): Promise<void> => {
  await axios.put(`${API_BASE_URL}/EducationalQualificationType/${id}`, data);
};

export const deleteEducationalQualificationType = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/EducationalQualificationType/${id}`);
};

// ========== Educational Qualification Issuer APIs ==========
export const getEducationalQualificationIssuersPaginated = async (params: any): Promise<EducationalQualificationIssuerDtoPaginationResult> => {
  const res = await axios.get<EducationalQualificationIssuerDtoPaginationResult>(`${API_BASE_URL}/EducationalQualificationIssuer/pagination`, { params });
  return res.data;
};

export const createEducationalQualificationIssuer = async (data: CreateEducationalQualificationIssuerDto): Promise<number> => {
  const res = await axios.post<number>(`${API_BASE_URL}/EducationalQualificationIssuer`, data);
  return res.data;
};

export const updateEducationalQualificationIssuer = async (id: number, data: UpdateEducationalQualificationIssuerDto): Promise<void> => {
  await axios.put(`${API_BASE_URL}/EducationalQualificationIssuer/${id}`, data);
};

export const deleteEducationalQualificationIssuer = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/EducationalQualificationIssuer/${id}`);
};

// ========== Educational Qualification Description APIs ==========
export const getEducationalQualificationDescriptionsPaginated = async (params: any): Promise<EducationalQualificationDescriptionDtoPaginationResult> => {
  const res = await axios.get<EducationalQualificationDescriptionDtoPaginationResult>(`${API_BASE_URL}/EducationalQualificationDescription/pagination`, { params });
  return res.data;
};

export const createEducationalQualificationDescription = async (data: CreateEducationalQualificationDescriptionDto): Promise<number> => {
  const res = await axios.post<number>(`${API_BASE_URL}/EducationalQualificationDescription`, data);
  return res.data;
};

export const updateEducationalQualificationDescription = async (id: number, data: UpdateEducationalQualificationDescriptionDto): Promise<void> => {
  await axios.put(`${API_BASE_URL}/EducationalQualificationDescription/${id}`, data);
};

export const deleteEducationalQualificationDescription = async (id: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/EducationalQualificationDescription/${id}`);
};

// ========== HelpTables APIs ==========
export const getHelpTableAreas = async (): Promise<any[]> => {
  const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/Area`);
  return res.data;
};

export const getHelpTableBranches = async (): Promise<any[]> => {
  const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/Branch`);
  return res.data;
};

export const getHelpTableCategories = async (): Promise<any[]> => {
  const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/Category`);
  return res.data;
};

export const getHelpTableCities = async (): Promise<any[]> => {
  const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/City`);
  return res.data;
};

export const getHelpTableEducationalQualificationDescriptions = async (): Promise<any[]> => {
  const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/EducationalQualificationDescription`);
  return res.data;
};

export const getHelpTableEducationalQualificationIssuers = async (): Promise<any[]> => {
  const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/EducationalQualificationIssuer`);
  return res.data;
};

export const getHelpTableEducationalQualificationTypes = async (): Promise<any[]> => {
  const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/EducationalQualificationType`);
  return res.data;
};

export const getHelpTableGroupDays = async (): Promise<any[]> => {
  const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/GroupDays`);
  return res.data;
};

export const getHelpTableGroupStatus = async (): Promise<any[]> => {
  const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/GroupStatus`);
  return res.data;
};

export const getHelpTablePermissions = async (): Promise<any[]> => {
  const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/Permission`);
  return res.data;
};

export const getHelpTableRoom = async (): Promise<any[]> => {
  const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/Room`);
  return res.data;
};

export const getHelpTableRoomTypes = async (): Promise<any[]> => {
  const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/RoomType`);
  return res.data;
};

export const getHelpTableSalaryTypes = async (): Promise<any[]> => {
  const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/SalaryType`);
  return res.data;
};

export const getHelpTableStudentFlowSteps = async (): Promise<any[]> => {
  const res = await axios.get<any[]>(`${API_BASE_URL}/HelpTables/StudentFlowStep`);
  return res.data;
};

// يمكنك إضافة المزيد من الدوال بنفس النمط حسب الحاجة

// ========== Student APIs ==========
export const createStudent = async (data: any): Promise<number> => {
  const res = await axios.post<number>(`${API_BASE_URL}/Students`, data);
  return res.data;
};

// ===================== إيصالات الدفع (Payments) من localStorage =====================

// Payment interface (only add if not already imported from types)
export interface Payment {
  id: string;
  studentId: string;
  groupId: string;
  amount: number;
  date: string;
  status: string;
  note?: string;
}

const RECEIPT_STORAGE_KEY = 'latin_academy_receipts';

function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
}

// استرجاع جميع الإيصالات
export const getReceipts = async (): Promise<Payment[]> => {
  return getFromLocalStorage<Payment[]>(RECEIPT_STORAGE_KEY, []);
};

// إضافة إيصال جديد
export const addReceipt = async (receipt: Payment): Promise<void> => {
  const receipts = await getReceipts();
  receipts.push(receipt);
  localStorage.setItem(RECEIPT_STORAGE_KEY, JSON.stringify(receipts));
};

// تحديث إيصال
export const updateReceipt = async (receipt: Payment): Promise<void> => {
  let receipts = await getReceipts();
  receipts = receipts.map(r => r.id === receipt.id ? receipt : r);
  localStorage.setItem(RECEIPT_STORAGE_KEY, JSON.stringify(receipts));
};

// حذف إيصال
export const deleteReceipt = async (id: string): Promise<void> => {
  let receipts = await getReceipts();
  receipts = receipts.filter(r => r.id !== id);
  localStorage.setItem(RECEIPT_STORAGE_KEY, JSON.stringify(receipts));
};

// تصفية الإيصالات حسب الطالب أو المجموعة أو الفترة
export const filterReceipts = async (filters: {
  studentId?: string;
  groupId?: string;
  fromDate?: string;
  toDate?: string;
}): Promise<Payment[]> => {
  let receipts = await getReceipts();
  if (filters.studentId) receipts = receipts.filter(r => r.studentId === filters.studentId);
  if (filters.groupId) receipts = receipts.filter(r => r.groupId === filters.groupId);
  if (filters.fromDate) receipts = receipts.filter(r => r.date >= filters.fromDate);
  if (filters.toDate) receipts = receipts.filter(r => r.date <= filters.toDate);
  return receipts;
};
