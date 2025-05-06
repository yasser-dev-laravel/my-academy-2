
export interface Student {
  id: string;
  name: string;
  mobile: string;
}

export interface AttendanceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group | null;
  students: Student[];
  attendance: Record<string, boolean>;
  setAttendance: (attendance: Record<string, boolean>) => void;
  date: string;
  setDate: (date: string) => void;
  sessionNumber: number;
  setSessionNumber: (n: number) => void;
  sessionImage: string | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleToggleAll: (present: boolean) => void;
  handleSaveAttendance: () => void;
}
