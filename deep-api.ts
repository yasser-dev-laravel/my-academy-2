// ============== Base Interfaces ==============
interface PaginationResult<T> {
  data: T[] | null;
  total: number;
}

// ============== Location Interfaces ==============
interface CityDto {
  id: number;
  name: string | null;
}

interface AreaDto {
  id: number;
  name: string | null;
  cityId: number;
  cityName: string | null;
}

interface CreateCityDto {
  name: string | null;
}

interface UpdateCityDto {
  id: number;
  name: string | null;
}

interface CreateAreaDto {
  name: string | null;
  cityId: number;
}

interface UpdateAreaDto {
  id: number;
  name: string | null;
  cityId: number;
}

// ============== Branch Interfaces ==============
interface BranchDto {
  id: number;
  name: string | null;
  address: string | null;
  areaId: number;
  areaName: string | null;
  campaignsCount: number;
}

interface CreateBranchDto {
  name: string;
  address: string;
  areaId: number;
}

interface UpdateBranchDto {
  id: number;
  name: string | null;
  address: string | null;
  areaId: number | null;
}

// ============== Room Interfaces ==============
enum RoomType {
  Lab = "معمل",
  Hall = "قاعة"
}

interface RoomDto {
  id: number;
  name: string | null;
  type: RoomType;
  capacity: number;
  branchId: number;
  branchName: string | null;
}

interface CreateRoomDto {
  name: string;
  type: RoomType;
  capacity: number | null;
  branchId: number;
}

interface UpdateRoomDto {
  id: number;
  name: string | null;
  type: RoomType;
  capacity: number | null;
  branchId: number;
}

// ============== Category Interfaces ==============
interface CategoryDto {
  id: number;
  name: string | null;
  description: string | null;
}

interface CreateCategoryDto {
  name: string;
  description: string | null;
}

interface UpdateCategoryDto {
  id: number;
  name: string | null;
  description: string | null;
}

// ============== Level Interfaces ==============
interface LevelDto {
  id: number;
  name: string | null;
  description: string | null;
  sessionsDiortion: number;
  price: number | null;
  applicationId: string | null;
  sessionsCount: number | null;
}

interface CreateLevelDto {
  name: string;
  description: string | null;
  sessionsDiortion: number;
  price: number | null;
  sessionsCount: number | null;
}

interface UpdateLevelDto {
  id: number;
  name: string | null;
  description: string | null;
  sessionsDiortion: number;
  price: number | null;
  sessionsCount: number | null;
}

// ============== Course Interfaces ==============
interface CourseDto {
  id: number;
  name: string | null;
  description: string | null;
  isActive: boolean;
  categoryId: number;
  categoryName: string | null;
  applicationId: number;
  levels: LevelDto[] | null;
}

interface CreateCourseDto {
  name: string;
  description: string | null;
  categoryId: number;
  isActive: boolean;
  levels: CreateLevelDto[];
}

interface UpdateCourseDto {
  id: number;
  name: string | null;
  description: string | null;
  isActive: boolean | null;
  categoryId: number | null;
  levels: UpdateLevelDto[];
}

// ============== Educational Qualification Interfaces ==============
interface EducationalQualificationDescriptionDto {
  id: number;
  name: string | null;
}

interface EducationalQualificationTypeDto {
  id: number;
  name: string | null;
}

interface EducationalQualificationIssuerDto {
  id: number;
  name: string | null;
}

interface CreateEducationalQualificationDescriptionDto {
  name: string;
}

interface UpdateEducationalQualificationDescriptionDto {
  id: number;
  name: string | null;
}

// ... Similar interfaces for Type and Issuer ...

// ============== Student Source Interfaces ==============
interface StudentSourceDto {
  id: number;
  name: string | null;
}

interface CreateStudentSourceDto {
  name: string;
}

interface UpdateStudentSourceDto {
  id: number;
  name: string | null;
}

// ============== Student Interfaces ==============
interface StudentDto {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  areaId: number | null;
  birthdate: string | null; // ISO date string
  applicationId: number;
  educationalQualificationDescriptionId: number | null;
  educationalQualificationTypeId: number | null;
  educationalQualificationIssuerId: number | null;
  sourceId: number | null;
  sourceName: string | null;
}

interface CreateStudentDto {
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  areaId: number | null;
  birthdate: string | null;
  educationalQualificationDescriptionId: number | null;
  educationalQualificationTypeId: number | null;
  educationalQualificationIssuerId: number | null;
  studentSourceId: number | null;
}

interface UpdateStudentDto {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  areaId: number | null;
  birthdate: string | null;
  educationalQualificationDescriptionId: number | null;
  educationalQualificationTypeId: number | null;
  educationalQualificationIssuerId: number | null;
  studentSourceId: number | null;
}

// ============== Lead Interfaces ==============
interface LeadDto {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  areaId: number | null;
  birthdate: string | null;
  educationalQualificationDescriptionId: number | null;
  educationalQualificationTypeId: number | null;
  educationalQualificationIssuerId: number | null;
  studentSourceId: number | null;
  studentId: number | null;
  referenceId: string; // UUID
  campaignId: number;
  status: string | null;
  createdAt: string; // ISO date string
  courseId: number;
  courseName: string | null;
}

interface CreateLeadDto {
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  areaId: number | null;
  birthdate: string | null;
  educationalQualificationDescriptionId: number | null;
  educationalQualificationTypeId: number | null;
  educationalQualificationIssuerId: number | null;
  studentSourceId: number | null;
  studentId: number | null;
  campaignId: number;
  status: string | null;
  courseId: number;
}

interface UpdateLeadDto extends CreateLeadDto {
  id: number;
}

interface RegisterLeadDto {
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  branchId: number | null;
  birthdate: string | null;
  courseId: number;
}

// ============== Campaign Interfaces ==============
interface CampaignDto {
  id: number;
  name: string | null;
  description: string | null;
  startDate: string; // ISO date string
  endDate: string | null; // ISO date string
  referenceId: string; // UUID
  leads: LeadDto[] | null;
  branchesIds: number[] | null;
  branchesNames: string[] | null;
  coursesIds: number[] | null;
  coursesNames: string[] | null;
}

interface CreateCampaignDto {
  name: string;
  description: string | null;
  startDate: string; // ISO date string
  endDate: string | null; // ISO date string
  leads: CreateLeadDto[] | null;
  branchIds: number[] | null;
  coursesIds: number[] | null;
}

interface UpdateCampaignDto {
  id: number;
  name: string | null;
  description: string | null;
  startDate: string | null; // ISO date string
  endDate: string | null; // ISO date string
  leads: UpdateLeadDto[] | null;
  branchIds: number[] | null;
  coursesIds: number[] | null;
}

// ============== Group Interfaces ==============
enum GroupDays {
  None = "None",
  Saturday = "Saturday",
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday"
}

interface GroupDto {
  id: number;
  name: string | null;
  startDate: string | null; // ISO date string
  endDate: string | null; // ISO date string
  instructorId: number;
  instructorName: string | null;
  branchId: number;
  branchName: string | null;
  levelId: number;
  levelName: string | null;
  courseId: number;
  courseName: string | null;
  statusId: number;
  statusName: string | null;
  roomId: number;
  roomName: string | null;
  roomCapacity: number;
  applicationId: number;
  days: GroupDays;
  daysAsText: string | null;
  startTime: string; // Time string
  endTime: string; // Time string
  students: StudentDto[] | null;
  sessions: SessionDto[] | null;
  daysArray: number[] | null;
}

interface CreateGroupDto {
  name: string;
  startDate: string | null; // ISO date string
  endDate: string | null; // ISO date string
  startTime: string; // Time string
  endTime: string | null; // Time string
  instructorId: number;
  levelId: number;
  roomId: number;
  statusId: number;
  studentIds: number[] | null;
  days: number[] | null;
}

interface UpdateGroupDto {
  id: number;
  name: string | null;
  startDate: string | null; // ISO date string
  endDate: string | null; // ISO date string
  startTime: string; // Time string
  endTime: string | null; // Time string
  instructorId: number;
  levelId: number;
  roomId: number;
  statusId: number;
  studentIds: number[] | null;
  days: number[] | null;
}

// ============== Session Interfaces ==============
interface SessionDto {
  id: number;
  roomId: number;
  roomName: string | null;
  instructorId: number;
  instructorName: string | null;
  startTime: string; // ISO date string
  courseId: number;
  courseName: string | null;
  studentsAbsent: SessionStudentDto[] | null;
  groupId: number;
  groupName: string | null;
  notes: string | null;
  groupStudents: StudentDto[] | null;
}

interface SessionStudentDto {
  studentId: number;
  studentName: string | null;
  studentPhone: string | null;
  isPresent: boolean;
  notes: string | null;
}

interface CreateSessionDto {
  roomId: number;
  instructorId: number;
  startTime: string; // ISO date string
  sessionStudents: CreateSessionStudentDto[] | null;
  groupId: number;
  notes: string | null;
}

interface CreateSessionStudentDto {
  studentId: number;
  isPresent: boolean;
  notes: string | null;
}

interface UpdateSessionDto {
  id: number;
  roomId: number | null;
  instructorId: number | null;
  startTime: string | null; // ISO date string
  sessionStudents: UpdateSessionStudentDto[] | null;
  groupId: number;
  notes: string | null;
  isCancelled: boolean | null;
  isPostponed: boolean | null;
}

interface UpdateSessionStudentDto {
  id: number;
  studentId: number;
  isPresent: boolean;
  notes: string | null;
}

// ============== User & Role Interfaces ==============
interface UserDto {
  id: number;
  name: string | null;
  email: string | null;
  emailVerified: string | null; // ISO date string
  image: string | null;
  salaryTypeId: number | null;
  salaryTypeName: string | null;
  salary: number;
  phone: string | null;
  address: string | null;
  nationalId: string | null;
  cityId: number | null;
  education: string | null;
  roleIds: number[] | null;
}

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  image: string | null;
  phone: string | null;
  address: string | null;
  nationalId: string | null;
  cityId: number | null;
  education: string | null;
  salaryTypeId: number | null;
  salary: number;
  roleIds: number[] | null;
}

interface UpdateUserDto {
  id: number;
  name: string | null;
  email: string | null;
  salaryTypeId: number | null;
  salary: number;
  image: string | null;
  phone: string | null;
  address: string | null;
  nationalId: string | null;
  cityId: number | null;
  education: string | null;
  roleIds: number[] | null;
}

interface RoleDto {
  id: number;
  name: string | null;
  description: string | null;
  usersCount: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  permissions: PermissionDto[] | null;
}

interface PermissionDto {
  id: number;
  code: string | null;
  description: string | null;
}

interface CreateRoleDto {
  name: string | null;
  description: string | null;
  permissionIds: number[] | null;
}

interface UpdateRoleDto {
  id: number;
  name: string | null;
  description: string | null;
  permissionIds: number[] | null;
}

// ============== Employee & Instructor Interfaces ==============
interface EmployeeDto {
  id: number;
  email: string | null;
  name: string | null;
  phone: string | null;
  address: string | null;
  nationalId: string | null;
  cityName: string | null;
  cityId: number | null;
  department: string | null;
  salary: number;
  salaryTypeId: number | null;
  salaryTypeName: string | null;
  jobTitle: string | null;
}

interface CreateEmployeeDto {
  id?: number | null;
  name: string;
  email: string;
  password?: string | null;
  phone: string | null;
  address: string | null;
  nationalId: string | null;
  cityId: number | null;
  department: string | null;
  salary: number;
  salaryTypeId: number | null;
  jobTitle: string | null;
}

interface UpdateEmployeeDto {
  id: number;
  phone: string | null;
  address: string | null;
  nationalId: string | null;
  cityId: number | null;
  department: string | null;
  salary: number | null;
  salaryTypeId: number | null;
  jobTitle: string | null;
}

interface InstructorDto {
  id: number;
  email: string | null;
  name: string | null;
  phone: string | null;
  address: string | null;
  nationalId: string | null;
  cityName: string | null;
  cityId: number | null;
  salary: number;
  salaryTypeId: number | null;
  salaryTypeName: string | null;
  coursesNames: string[] | null;
  coursesIds: number[] | null;
}

interface CreateInstructorDto {
  id?: number | null;
  name: string;
  email: string;
  password?: string | null;
  phone: string | null;
  address: string | null;
  nationalId: string | null;
  cityId: number | null;
  salary: number;
  salaryTypeId: number | null;
  coursesIds: number[] | null;
}

interface UpdateInstructorDto {
  id: number;
  phone: string | null;
  address: string | null;
  nationalId: string | null;
  cityId: number | null;
  salary: number | null;
  salaryTypeId: number | null;
  coursesIds: number[] | null;
}

// ============== Message Template Interfaces ==============
enum StudentFlowStep {
  LeadRegistration = "LeadRegistration",
  StudentAddedToGroup = "StudentAddedToGroup",
  StudentMarkedAsAbsent = "StudentMarkedAsAbsent",
  SessionCancelled = "SessionCancelled",
  SessionPostponed = "SessionPostponed",
  StudentBirthday = "StudentBirthday"
}

interface MessageTemplateDto {
  id: number;
  createdAt: string; // ISO date string
  updatedAt: string | null; // ISO date string
  deletedAt: string | null; // ISO date string
  courseId: number | null;
  courseName: string | null;
  name: string | null;
  sendAutomatically: boolean;
  body: string | null;
  trigger: StudentFlowStep;
}

interface CreateMessageTemplateDto {
  name: string | null;
  sendAutomatically: boolean | null;
  courseId: number | null;
  body: string | null;
  trigger: StudentFlowStep;
}

interface UpdateMessageTemplateDto {
  id: number;
  courseId: number | null;
  name: string | null;
  sendAutomatically: boolean | null;
  body: string | null;
  trigger: StudentFlowStep;
}

// ============== Course Enrollment & Payment Interfaces ==============
interface CreateCourseEnrollmentDto {
  studentId: number;
  courseId: number;
  levelId: number;
  totalFee: number;
}

interface CreateCoursePaymentDto {
  courseEnrollmentId: number;
  amount: number;
  description: string | null;
}

// ============== Auth Interfaces ==============
interface LoginRequestDto {
  userNameOrEmail: string | null;
  password: string | null;
}

interface LoginResponseDto {
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpires: string; // ISO date string
  refreshTokenExpires: string; // ISO date string
  userId: number;
  userName: string | null;
  roles: string[] | null;
}

interface RefreshTokenRequestDto {
  refreshToken: string | null;
}

// ============== Pagination Interfaces ==============
interface AreaDtoPaginationResult extends PaginationResult<AreaDto> {}
interface BranchDtoPaginationResult extends PaginationResult<BranchDto> {}
interface CampaignDtoPaginationResult extends PaginationResult<CampaignDto> {}
interface CategoryDtoPaginationResult extends PaginationResult<CategoryDto> {}
interface CityDtoPaginationResult extends PaginationResult<CityDto> {}
interface CourseDtoPaginationResult extends PaginationResult<CourseDto> {}
interface EducationalQualificationDescriptionDtoPaginationResult extends PaginationResult<EducationalQualificationDescriptionDto> {}
interface EducationalQualificationIssuerDtoPaginationResult extends PaginationResult<EducationalQualificationIssuerDto> {}
interface EducationalQualificationTypeDtoPaginationResult extends PaginationResult<EducationalQualificationTypeDto> {}
interface EmployeeDtoPaginationResult extends PaginationResult<EmployeeDto> {}
interface GroupDtoPaginationResult extends PaginationResult<GroupDto> {}
interface InstructorDtoPaginationResult extends PaginationResult<InstructorDto> {}
interface LeadDtoPaginationResult extends PaginationResult<LeadDto> {}
interface LevelDtoPaginationResult extends PaginationResult<LevelDto> {}
interface MessageTemplateDtoPaginationResult extends PaginationResult<MessageTemplateDto> {}
interface RoleDtoPaginationResult extends PaginationResult<RoleDto> {}
interface RoomDtoPaginationResult extends PaginationResult<RoomDto> {}
interface SessionDtoPaginationResult extends PaginationResult<SessionDto> {}
interface StudentDtoPaginationResult extends PaginationResult<StudentDto> {}
interface StudentSourceDtoPaginationResult extends PaginationResult<StudentSourceDto> {}
interface UserDtoPaginationResult extends PaginationResult<UserDto> {}