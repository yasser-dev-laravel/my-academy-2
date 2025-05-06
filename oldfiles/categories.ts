import axios from "./axios";
import { API_BASE_URL } from "./constants";
const BASE_URL = `${API_BASE_URL}/Categories`;

// ملف التصنيفات (Categories) بعد التعديل ليعتمد على الملفات الموحدة
import type { CategoryDto, CategoryDtoPaginationResult, CreateCategoryDto } from './types';
import { getCategoriesPaginated, createCategory, updateCategory, deleteCategory } from './api';

// يمكنك الآن استيراد الدوال والأنواع مباشرة من هذا الملف أو من api.ts/types.ts حسب الحاجة
// مثال:
// import { getCategoriesPaginated } from './api';
// import { CategoryDto } from './types';

export type { CategoryDto, CategoryDtoPaginationResult, CreateCategoryDto };
export { getCategoriesPaginated, createCategory, updateCategory, deleteCategory };
