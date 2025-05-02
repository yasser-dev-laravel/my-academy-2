import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  // Courses
  getCourses: () => axios.get(`${API_BASE_URL}/courses`).then(res => res.data),
  
  // Levels
  getLevels: () => axios.get(`${API_BASE_URL}/levels`).then(res => res.data),
  
  // Groups
  getGroups: () => axios.get(`${API_BASE_URL}/groups`).then(res => res.data),
  updateGroup: (groupId: string, data: any) => axios.put(`${API_BASE_URL}/groups/${groupId}`, data),
  createGroup: (data: any) => axios.post(`${API_BASE_URL}/groups`, data),
  
  // Sessions
  getGroupSessions: (groupId: string) => axios.get(`${API_BASE_URL}/sessions?groupId=${groupId}`).then(res => res.data),
  createSession: (data: any) => axios.post(`${API_BASE_URL}/sessions`, data),
  
  // Attendance
  getAttendance: (sessionId: string) => axios.get(`${API_BASE_URL}/attendance?sessionId=${sessionId}`).then(res => res.data),
  saveAttendance: (data: any) => axios.post(`${API_BASE_URL}/attendance`, data),
  
  // Students
  getStudents: () => axios.get(`${API_BASE_URL}/students`).then(res => res.data),
  
  // Instructors
  getInstructors: () => axios.get(`${API_BASE_URL}/instructors`).then(res => res.data),
  
  // Branches
  getBranches: () => axios.get(`${API_BASE_URL}/branches`).then(res => res.data),
  
  // Labs
  getLabs: () => axios.get(`${API_BASE_URL}/labs`).then(res => res.data),
};