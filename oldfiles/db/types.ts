// تم توليد هذا الملف تلقائياً من new-api.json
// يحتوي على تعريفات TypeScript للواجهات المستخدمة في البرنامج
// تمت مزامنة هذا الملف مع مخطط OpenAPI الأخير في new-api.json

export interface AreaDto {
  id: number;
  name?: string | null;
  cityId: number;
  cityName?: string | null;
}

export interface BranchDto {
  id: number;
  name?: string | null;
  address?: string | null;
  areaId: number;
  areaName?: string | null;
  campaignsCount: number;
}

export interface CampaignDto {
  id: number;
  name?: string | null;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  referenceId: string;
  leads?: LeadDto[] | null; // يتطلب تعريف LeadDto لاحقاً
  branchesIds?: number[] | null;
  branchesNames?: string[] | null;
  coursesIds?: number[] | null;
  coursesNames?: string[] | null;
}

export interface CategoryDto {
  id: number;
  name?: string | null;
  description?: string | null;
}

// Pagination Result Interfaces
export interface AreaDtoPaginationResult {
  data?: AreaDto[] | null;
  total: number;
}
export interface BranchDtoPaginationResult {
  data?: BranchDto[] | null;
  total: number;
}
export interface CampaignDtoPaginationResult {
  data?: CampaignDto[] | null;
  total: number;
}
export interface CategoryDtoPaginationResult {
  data?: CategoryDto[] | null;
  total: number;
}

export interface CityDto {
  id: number;
  name?: string | null;
}
export interface CityDtoPaginationResult {
  data?: CityDto[] | null;
  total: number;
}

export interface CourseDto {
  id: number;
  name?: string | null;
  description?: string | null;
  isActive: boolean;
  categoryId: number;
  categoryName?: string | null;
  applicationId: number;
  levels?: LevelDto[] | null; // تعريف LevelDto لاحقاً
}
export interface CourseDtoPaginationResult {
  data?: CourseDto[] | null;
  total: number;
}

export interface LevelDto {
  id: number;
  name?: string | null;
  description?: string | null;
  price?: number | null;
  sessionsCount?: number | null;
}

export interface CreateLevelDto {
  name: string;
  description?: string | null;
  price?: number | null;
  sessionsCount?: number | null;
}

export interface CreateAreaDto {
  name?: string | null;
  cityId: number;
}

export interface CreateBranchDto {
  name: string;
  address: string;
  areaId: number;
}

export interface CreateCampaignDto {
  name: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  leads?: CreateLeadDto[] | null; // تعريف CreateLeadDto لاحقاً
  branchIds?: number[] | null;
  coursesIds?: number[] | null;
}

export interface LeadDto {
  id: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  areaId?: number | null;
  birthdate?: string | null;
  educationalQualificationDescriptionId?: number | null;
  educationalQualificationTypeId?: number | null;
  educationalQualificationIssuerId?: number | null;
  studentSourceId?: number | null;
  studentId?: number | null;
  referenceId: string;
  campaignId: number;
  status?: string | null;
  createdAt: string;
  courseId: number;
  courseName?: string | null;
}

export interface LeadDtoPaginationResult {
  data?: LeadDto[] | null;
  total: number;
}

export interface CreateLeadDto {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  branchId?: number | null;
  birthdate?: string | null;
  courseId: number;
}

export interface CreateCategoryDto {
  name: string;
  description?: string | null;
}

// For updating a category, all fields are optional
export interface UpdateCategoryDto {
  name?: string;
  description?: string | null;
}


export interface CreateCityDto {
  name?: string | null;
}

export interface CreateCourseDto {
  name: string;
  description?: string | null;
  categoryId: number;
  isActive: boolean;
  levels: CreateLevelDto[]; // تعريف CreateLevelDto لاحقاً
}

// ========== Educational Qualification Types ==========
export interface EducationalQualificationTypeDto {
  id: number;
  name?: string | null;
}

export interface EducationalQualificationTypeDtoPaginationResult {
  data?: EducationalQualificationTypeDto[] | null;
  total: number;
}

export interface CreateEducationalQualificationTypeDto {
  name: string;
}

export interface UpdateEducationalQualificationTypeDto {
  id: number;
  name?: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: string;
  refreshTokenExpires: string;
  userId: number;
  // أضف أي حقول أخرى حسب الحاجة
}
// ========== Category ==========
export interface Category {
  id: string | number;
  name: string;
  description: string;
}

export interface CategoriesTableProps {
  categories: Category[];
  onDelete: (id: string | number) => void;
  onEdit: (category: Category) => void;
}

// ========== Room ==========
export interface Room {
  id: string | number;
  name: string;
  type: string;
  capacity: number;
  branchName: string;
}

export interface RoomsTableProps {
  rooms: Room[];
  onDelete: (id: string | number) => void;
  onEdit: (room: Room) => void;
}

// ========== Branch ==========
export interface Branch {
  id: string;
  name: string;
  address?: string;
  governorate?: string;
  areaId?: string;
  areaDisplay?: string;
}

export interface BranchesTableProps {
  branches: Branch[];
  onEdit: (branch: Branch) => void;
  onDelete: (id: string) => void;
}

// ========== Room ==========

// ========== Group ==========
export interface GroupStudent {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  areaId: number;
  birthdate: string;
  applicationId: number;
  educationalQualificationDescriptionId: number;
  educationalQualificationTypeId: number;
  educationalQualificationIssuerId: number;
  sourceId: number;
  sourceName: string;
}

export interface GroupSessionStudent {
  studentId: number;
  studentName: string;
  studentPhone: string;
  isPresent: boolean;
  notes: string;
}

export interface GroupSession {
  id: number;
  roomId: number;
  roomName: string;
  instructorId: number;
  instructorName: string;
  startTime: string;
  students: GroupSessionStudent[];
  groupId: number;
  groupName: string;
  notes: string;
}




export interface RoomDto {
  id: number;
  name: string;
  type: string;
  capacity: number;
  branchId: number;
  branchName: string;
}

export interface RoomDtoPaginationResult {
  data?: RoomDto[] | null;
  total: number;
}

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

// ========== Educational Qualification Issuer ==========
export interface EducationalQualificationIssuerDto {
  id: number;
  name?: string | null;
}

export interface EducationalQualificationIssuerDtoPaginationResult {
  data?: EducationalQualificationIssuerDto[] | null;
  total: number;
}

export interface CreateEducationalQualificationIssuerDto {
  name: string;
}

export interface UpdateEducationalQualificationIssuerDto {
  id: number;
  name?: string | null;
}

// ========== Educational Qualification Description ==========
export interface EducationalQualificationDescriptionDto {
  id: number;
  name?: string | null;
}

export interface EducationalQualificationDescriptionDtoPaginationResult {
  data?: EducationalQualificationDescriptionDto[] | null;
  total: number;
}

export interface CreateEducationalQualificationDescriptionDto {
  name: string;
}

export interface UpdateEducationalQualificationDescriptionDto {
  id: number;
  name?: string | null;
}

// ========== Employee ==========
export interface EmployeeDto {
  id?: number | null;
  name: string;
  email: string;
  password?: string | null;
  phone?: string | null;
  address?: string | null;
  nationalId?: string | null;
  cityId?: number | null;
  department?: string | null;
  salary: number;
  salaryTypeId?: number | null;
  jobTitle?: string | null;
}

export interface EmployeeDtoPaginationResult {
  data?: EmployeeDto[] | null;
  total: number;
}

export interface CreateEmployeeDto {
  email: string;
  name: string;
  password?: string | null;
  phone?: string | null;
  address?: string | null;
  nationalId?: string | null;
  cityId?: number | null;
  department?: string | null;
  salary: number;
  salaryTypeId?: number | null;
  jobTitle?: string | null;
}

export interface UpdateEmployeeDto {
  id: number;
  email?: string | null;
  name?: string | null;
  password?: string | null;
  phone?: string | null;
  address?: string | null;
  nationalId?: string | null;
  cityId?: number | null;
  department?: string | null;
  salary?: number | null;
  salaryTypeId?: number | null;
  jobTitle?: string | null;
}

// ========== User ==========
export interface UserDto {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  roleIds?: number[] | null;
}

export interface UserDtoPaginationResult {
  data?: UserDto[] | null;
  total: number;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  address?: string | null;
  roleId: number;
  image?: string | null;
  nationalId?: string | null;
  cityId?: number | null;
  education?: string | null;
  salaryTypeId?: number | null;
  salary?: number | null;
  roleIds?: number[] | null;
}

export interface UpdateUserDto {
  id: number;
  name?: string | null;
  email?: string | null;
  password?: string | null;
  phone?: string | null;
  address?: string | null;
  roleId?: number | null;
  image?: string | null;
  nationalId?: string | null;
  cityId?: number | null;
  education?: string | null;
  salaryTypeId?: number | null;
  salary?: number | null;
  roleIds?: number[] | null;
}

// ========== Role ==========
export interface RoleDto {
  id: number;
  name?: string | null;
  description?: string | null;
  usersCount?: number;
  createdAt?: string;
  updatedAt?: string;
  permissionIds?: number[] | null;
}

export interface RoleDtoPaginationResult {
  data?: RoleDto[] | null;
  total: number;
}

export interface CreateRoleDto {
  name?: string | null;
  description?: string | null;
  permissionIds?: number[] | null;
}

export interface UpdateRoleDto {
  id: number;
  name?: string | null;
  description?: string | null;
  permissionIds?: number[] | null;
}

// ========== Course (Unified Table/Props) ==========
export interface Course {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  categoryId: number;
  categoryName: string;
  applicationId: number;
  levels: {
    id: number;
    name: string;
    description: string;
    price: number;
    sessionsCount: number;
  }[];
}

export interface CoursesTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (id: number) => void;
}

// ========== Instructor ==========
export interface InstructorDto {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  nationalId?: string | null;
  cityId?: number | null;
  department?: string | null;
  salary?: number | null;
  salaryTypeId?: number | null;
  jobTitle?: string | null;
  // أضف أي حقول أخرى لازمة لاحقاً
}

export interface InstructorDtoPaginationResult {
  data?: InstructorDto[] | null;
  total: number;
}

export interface CreateInstructorDto {
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  nationalId?: string | null;
  cityId?: number | null;
  department?: string | null;
  salary?: number | null;
  salaryTypeId?: number | null;
  jobTitle?: string | null;
}

export interface UpdateInstructorDto {
  id: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  nationalId?: string | null;
  cityId?: number | null;
  department?: string | null;
  salary?: number | null;
  salaryTypeId?: number | null;
  jobTitle?: string | null;
}

// ========== Employee (Unified Table/Props) ==========
export interface Employee {
  id: string | number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  nationalId?: string | null;
  cityName?: string | null;
  salary?: number | null;
  salaryTypeName?: string | null;
  roles?: string[];
  jobTitle?: string | null;
}

export interface EmployeesTableProps {
  employees: Employee[];
  onDelete: (id: string | number) => void;
  onEdit: (employee: Employee) => void;
}

// ========== Group (Unified Table/Props) ==========

// ==== Export aliases for easier imports ====
export type City = CityDto;
export type Area = AreaDto;
export interface Group {
  id: number;
  name: string;
  startDate?: string;
  endDate?: string;
  instructorId?: number;
  instructorName?: string;
  branchId?: number;
  branchName?: string;
  levelId?: number;
  levelName?: string;
  statusId?: number;
  statusName?: string;
  roomId?: number;
  roomName?: string;
  roomCapacity?: number;
  applicationId?: number;
  days?: string;
  daysAsText?: string;
  startTime?: string;
  endTime?: string;
  students?: any[];
  sessions?: any[];
  daysArray?: number[];
  status?: string;
}

export interface GroupsTableProps {
  groups: Group[];
  courses: { id: string; name: string }[];
  levels: { id: string; name: string }[];
  branches: { id: string; name: string }[];
  rooms: { id: string; name: string }[];
  instructors: { id: string; name: string }[];
  onEdit: (group: Group) => void;
  onDelete?: (id: number) => void;
}
