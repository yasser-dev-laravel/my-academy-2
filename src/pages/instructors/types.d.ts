export interface Instructor {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  nationalId: string;
  cityName: string;
  salary: number;
  salaryTypeId: number;
  salaryTypeName: string;
  coursesNames: string[];
  coursesIds: number[];
}