import axios from "./axios";
import { API_HelpTable_URL } from "./constants";
const API_HelpTable_URLL = `${API_BASE_URL}/Rooms`;
import { API_BASE_URL } from "./constants";
const BASE_URL = `${API_BASE_URL}/Rooms`;

// ملف القاعات (Rooms) بعد التعديل ليعتمد على الملفات الموحدة
import type { RoomDto, RoomDtoPaginationResult, CreateRoomDto } from './types';
import { getRoomsPaginated, createRoom, updateRoom, deleteRoom } from './api';

// إذا كنت تحتاج getAuthHeaders في أماكن أخرى يمكنك نقلها لملف منفصل (مثل utils/auth.ts)
// وإلا يمكنك حذفها من هنا إذا لم تعد مطلوبة

export type { RoomDto, RoomDtoPaginationResult, CreateRoomDto };
export { getRoomsPaginated, createRoom, updateRoom, deleteRoom };
