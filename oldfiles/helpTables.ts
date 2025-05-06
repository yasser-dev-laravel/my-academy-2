import axios from "./axios";
import { API_HelpTable_URL } from "./constants";

export const getHelpTableArea = () => axios.get(`${API_HelpTable_URL}/Area`);
export const getHelpTableBranch = () => axios.get(`${API_HelpTable_URL}/Branch`);
export const getHelpTableCategory = () => axios.get(`${API_HelpTable_URL}/Category`);
export const getHelpTableCity = () => axios.get(`${API_HelpTable_URL}/City`);
export const getHelpTableEducationalQualificationDescription = () => axios.get(`${API_HelpTable_URL}/EducationalQualificationDescription`);
export const getHelpTableEducationalQualificationIssuer = () => axios.get(`${API_HelpTable_URL}/EducationalQualificationIssuer`);
export const getHelpTableEducationalQualificationType = () => axios.get(`${API_HelpTable_URL}/EducationalQualificationType`);
export const getHelpTableGroupDays = () => axios.get(`${API_HelpTable_URL}/GroupDays`);
export const getHelpTableGroupStatus = () => axios.get(`${API_HelpTable_URL}/GroupStatus`);
export const getHelpTablePermission = () => axios.get(`${API_HelpTable_URL}/Permission`);
export const getHelpTableRoom = () => axios.get(`${API_HelpTable_URL}/Room`);
export const getHelpTableStudentFlowStep = () => axios.get(`${API_HelpTable_URL}/StudentFlowStep`);
export const getHelpTableRoomType = () => axios.get(`${API_HelpTable_URL}/RoomType`);
export const getHelpTableSalaryType = () => axios.get(`${API_HelpTable_URL}/SalaryType`);

