// This file contains unified types for core API entities, auto-generated from new-api.json
// Each type is named according to its entity and operation, e.g., BrancheGetByIdType, BrancheEditType, etc.
// Example types below. Extend as needed for your API schemas.
export interface LoginResponse {
  // Define the structure of LoginResponse here
  token: string;
  userId: number;
}

export interface BrancheGetByIdType {
  id: number;
  name: string;
  address?: string;
  areaId: number;
  areaName?: string | null;
  campaignsCount?: number;
}

export interface BrancheEditType {
  id: number;
  name: string;
  address: string;
  areaId: number;
}

export interface AreaGetByIdType {
  id: number;
  name?: string | null;
  cityId: number;
  cityName?: string | null;
}

export interface AreaEditType {
  id: number;
  name?: string | null;
  cityId: number;
}

export interface AreaCreateType {
  name?: string | null;
  cityId: number;
}
export interface AreaGetAllType extends AreaGetByIdType {}
export interface AreaGetByPaginationType {
  data?: AreaGetByIdType[] | null;
  total: number;
}

export interface BranchCreateType {
  name: string;
  address: string;
  areaId: number;
}
export interface BranchGetAllType extends BrancheGetByIdType {}
export interface BranchGetByPaginationType {
  data?: BrancheGetByIdType[] | null;
  total: number;
}

export interface UserGetByIdType {
  id: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  nationalId?: string | null;
  cityId?: number | null;
  education?: string | null;
  roleIds?: number[] | null;
  image?: string | null;
  salaryTypeId?: number | null;
  salaryTypeName?: string | null;
  salary?: number;
}

// =====================
// Campaign Entity Types
// =====================
/**
 * Campaign entity for GetById
 */
export interface CampaignGetByIdType {
  id: number;
  name: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  branchIds?: number[] | null;
  coursesIds?: number[] | null;
}

/**
 * Campaign entity for Create
 */
export interface CampaignCreateType {
  name: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  leads?: LeadCreateType[] | null;
  branchIds?: number[] | null;
  coursesIds?: number[] | null;
}

/**
 * Campaign entity for Update
 */
export interface CampaignEditType {
  id: number;
  name: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  leads?: LeadCreateType[] | null;
  branchIds?: number[] | null;
  coursesIds?: number[] | null;
}

export interface CampaignGetAllType extends CampaignGetByIdType {}
export interface CampaignGetByPaginationType {
  data?: CampaignGetByIdType[] | null;
  total: number;
}

// =====================
// Category Entity Types
// =====================
/**
 * Category entity for GetById
 */
export interface CategoryGetByIdType {
  id: number;
  name: string;
  description?: string | null;
}

/**
 * Category entity for Create
 */
export interface CategoryCreateType {
  name: string;
  description?: string | null;
}

/**
 * Category entity for Update
 */
export interface CategoryEditType {
  id: number;
  name: string;
  description?: string | null;
}

export interface CategoryGetAllType extends CategoryGetByIdType {}
export interface CategoryGetByPaginationType {
  data?: CategoryGetByIdType[] | null;
  total: number;
}

// =====================
// City Entity Types
// =====================
/**
 * City entity for GetById
 */
export interface CityGetByIdType {
  id: number;
  name?: string | null;
}

/**
 * City entity for Create
 */
export interface CityCreateType {
  name?: string | null;
}

/**
 * City entity for Update
 */
export interface CityEditType {
  id: number;
  name?: string | null;
}

export interface CityGetAllType extends CityGetByIdType {}
export interface CityGetByPaginationType {
  data?: CityGetByIdType[] | null;
  total: number;
}

// =====================
// Course Entity Types
// =====================
/**
 * Course entity for GetById
 */
export interface CourseGetByIdType {
  id: number;
  name: string;
  description?: string | null;
  categoryId: number;
  isActive: boolean;
  levels: LevelGetByIdType[];
}

/**
 * Course entity for Create
 */
export interface CourseCreateType {
  name: string;
  description?: string | null;
  categoryId: number;
  isActive: boolean;
  levels: LevelCreateType[];
}

/**
 * Course entity for Update
 */
export interface CourseEditType {
  id: number;
  name: string;
  description?: string | null;
  categoryId: number;
  isActive: boolean;
  levels: LevelEditType[];
}

export interface CourseGetAllType extends CourseGetByIdType {}
export interface CourseGetByPaginationType {
  data?: CourseGetByIdType[] | null;
  total: number;
}

// =====================
// EducationalQualificationDescription Entity Types
// =====================
export interface EducationalQualificationDescriptionGetByIdType {
  id: number;
  name: string;
}
export interface EducationalQualificationDescriptionCreateType {
  name: string;
}
export interface EducationalQualificationDescriptionEditType {
  id: number;
  name: string;
}

// =====================
// EducationalQualificationType Entity Types
// =====================
export interface EducationalQualificationTypeGetByIdType {
  id: number;
  name: string;
}
export interface EducationalQualificationTypeCreateType {
  name: string;
}
export interface EducationalQualificationTypeEditType {
  id: number;
  name: string;
}

// =====================
// Employee Entity Types
// =====================
export interface EmployeeGetByIdType {
  id: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  nationalId?: string | null;
  cityId?: number | null;
  salary?: number;
  salaryTypeId?: number | null;
  salaryTypeName?: string | null;
  jobTitle?: string | null;
  coursesIds?: number[] | null;
}
export interface EmployeeCreateType {
  name?: string | null;
  email?: string | null;
  password?: string | null;
  phone?: string | null;
  address?: string | null;
  nationalId?: string | null;
  cityId?: number | null;
  salary?: number;
  salaryTypeId?: number | null;
  jobTitle?: string | null;
  coursesIds?: number[] | null;
}
export interface EmployeeEditType {
  id: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  nationalId?: string | null;
  cityId?: number | null;
  salary?: number;
  salaryTypeId?: number | null;
  jobTitle?: string | null;
  coursesIds?: number[] | null;
}

// =====================
// Level Entity Types
// =====================
export interface LevelGetByIdType {
  id: number;
  name: string;
  description?: string | null;
  sessionsDiortion: number;
  price?: number | null;
  sessionsCount?: number | null;
}
export interface LevelCreateType {
  name: string;
  description?: string | null;
  sessionsDiortion: number;
  price?: number | null;
  sessionsCount?: number | null;
}
export interface LevelEditType {
  id: number;
  name: string;
  description?: string | null;
  sessionsDiortion: number;
  price?: number | null;
  sessionsCount?: number | null;
}

// =====================
// Lead Entity Types
// =====================
export interface LeadCreateType {
  name: string;
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
  campaignId: number;
  status?: string | null;
  courseId: number;
}

// =====================
// MessageTemplate Entity Types
// =====================
export interface MessageTemplateCreateType {
  name?: string | null;
  sendAutomatically?: boolean | null;
  courseId?: number | null;
  body?: string | null;
  trigger?: string | null; // StudentFlowStep
}
export interface MessageTemplateEditType {
  id: number;
  name?: string | null;
  sendAutomatically?: boolean | null;
  courseId?: number | null;
  body?: string | null;
  trigger?: string | null;
}

// =====================
// Role Entity Types
// =====================
export interface RoleCreateType {
  name?: string | null;
  description?: string | null;
  permissionIds?: number[] | null;
}
export interface RoleEditType {
  id: number;
  name?: string | null;
  description?: string | null;
  permissionIds?: number[] | null;
}

// =====================
// Instructor Entity Types
// =====================
export interface InstructorGetByIdType {
  id: number;
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  nationalId?: string | null;
}

export interface InstructorCreateType {
  name: string;
  email: string;
  password?: string | null;
  phone?: string | null;
  address?: string | null;
  nationalId?: string | null;
  cityId?: number | null;
  salary?: number;
  salaryTypeId?: number | null;
  coursesIds?: number[] | null;
}
export interface InstructorEditType {
  id: number;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  nationalId?: string | null;
  cityId?: number | null;
  salary?: number;
  salaryTypeId?: number | null;
  coursesIds?: number[] | null;
}
export interface InstructorGetAllType extends InstructorGetByIdType {}
export interface InstructorGetByPaginationType {
  data?: InstructorGetByIdType[] | null;
  total: number;
}

// =====================
// Group Entity Types
// =====================
export interface GroupGetByIdType {
  id: number;
  name?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  instructorId: number;
  instructorName?: string | null;
  branchId: number;
  branchName?: string | null;
  levelId: number;
  levelName?: string | null;
  courseId: number;
  courseName?: string | null;
  statusId: number;
  statusName?: string | null;
  roomId: number;
  roomName?: string | null;
  roomCapacity: number;
  applicationId: number;
  days?: string | null;
  daysAsText?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  students?: any[] | null;
  sessions?: any[] | null;
  daysArray?: number[] | null;
}

export interface GroupCreateType {
  name: string;
  startDate?: string | null;
  endDate?: string | null;
  instructorId: number;
  levelId: number;
  roomId: number;
  statusId: number;
  startTime?: string | null;
  endTime?: string | null;
  studentIds?: number[] | null;
  days?: number[] | null;
}
export interface GroupEditType {
  id: number;
  name?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  instructorId: number;
  levelId: number;
  roomId: number;
  statusId: number;
  startTime?: string | null;
  endTime?: string | null;
  studentIds?: number[] | null;
  days?: number[] | null;
}
export interface GroupGetAllType extends GroupGetByIdType {}
export interface GroupGetByPaginationType {
  data?: GroupGetByIdType[] | null;
  total: number;
}

// =====================
// Add more entities as needed, following the same pattern above
