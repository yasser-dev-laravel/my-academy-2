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
