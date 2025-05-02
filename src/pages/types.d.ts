export interface Permission {
  screen: string;
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

export interface CourseLevel {
  id: string;
  price: number;
}

export interface Role {
  id: number;
  name: string;
  code: string;
  permissions: Permission[];
}

export interface HelpTableArea {
  id: number;
  name: string;
  cityId?: number;
  cityName?: string;
}

export interface HelpTableBranch {
  id: number;
  name: string;
  address?: string;
  areaId?: number;
  areaName?: string;
  campaignsCount?: number;
}

export interface HelpTableCategory {
  id: number;
  name: string;
  description?: string;
}

export interface HelpTableCity {
  id: number;
  name: string;
}

export interface HelpTableEducationalQualificationDescription {
  id: number;
  name: string;
}

export interface HelpTableEducationalQualificationIssuer {
  id: number;
  name: string;
}

export interface HelpTableEducationalQualificationType {
  id: number;
  name: string;
}

export interface HelpTableGroupDays {
  value: string;
  label: string;
}

export interface HelpTableGroupStatus {
  value: string;
  label: string;
}

export interface HelpTablePermission {
  id: number;
  code: string;
  description?: string;
}

export interface HelpTableRoom {
  id: number;
  name: string;
  type?: string;
  capacity?: number;
  branchId?: number;
  branchName?: string;
}

export interface HelpTableStudentFlowStep {
  value: string;
  label: string;
}

export interface HelpTableRoomType {
  value: string;
  label: string;
}

export interface HelpTableSalaryType {
  id: number;
  name: string;
}
