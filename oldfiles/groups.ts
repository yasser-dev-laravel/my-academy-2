import axios from './axios';
import { API_BASE_URL } from "./constants";
const BASE_URL = `${API_BASE_URL}/Groups`;

// ملف المجموعات (Groups) بعد التعديل ليعتمد على الملفات الموحدة
import type { Group, GroupSession, GroupSessionStudent, GroupStudent } from './types';
import { getGroups, addGroup, updateGroup, deleteGroup } from './api';

// يمكنك الآن استيراد الدوال والأنواع مباشرة من هذا الملف أو من api.ts/types.ts حسب الحاجة
// مثال:
// import { getGroups } from './api';
// import type { Group } from './types';

export type { Group, GroupSession, GroupSessionStudent, GroupStudent };
export { getGroups, addGroup, updateGroup, deleteGroup };
