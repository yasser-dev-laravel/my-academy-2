import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogDescription, DialogFooter } from "@/components/ui/dialog";

import { toast } from "react-hot-toast";
import { api } from '@/utils/api';

interface Course {
  id: string;
  name: string;
}

interface CourseLevel {
  id: string;
  levelNumber: number;
  name: string;
  courseId: string;
  lectureCount: number;
}

interface Branch {
  id: string;
  name: string;
}

interface Lab {
  id: string;
  name: string;
  branchId: string;
}

interface Group {
  id: string;
  name: string;
  courseId: string;
  levelId: string;
  instructorId: string;
  labId: string;
  startTime: string;
  weeklyDays: string[];
  startDate: string;
  endDate: string;
  code: string;
  studentIds: string[];
  lectureCount?: number;
  lecturesDone?: number;
  status?: string;
}

interface Student {
  id: string;
  name: string;
  mobile: string;
  applicationNumber: string;
}

const TIME_SLOTS = Array.from({ length: 31 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2);
  const min = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${min}`;
});

function getDayGroups(groups: Group[], date: string, labs: Lab[]) {
  // لكل قاعة، لكل فترة زمنية، ابحث عن المجموعة التي لديها محاضرة
  // (هنا نعتمد أن كل مجموعة لديها startTime ومدة وعدد مرات أسبوعية)
  const result: Record<string, Record<string, Group | null>> = {};
  labs.forEach(lab => {
    result[lab.id] = {};
    TIME_SLOTS.forEach(slot => {
      // ابحث عن مجموعة تبدأ في هذا الوقت في هذه القاعة في هذا اليوم
      result[lab.id][slot] = groups.find(g => g.labId === lab.id && g.startTime === slot && g.weeklyDays.includes(getArabicDayName(new Date(date).getDay())) && g.startDate <= date && g.endDate >= date) || null;
    });
  });
  return result;
}

// تصدير دالة اليوم بالعربية لاستخدامها خارجيًا
export function getArabicDayName(day: number) {
  return ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"][day];
}

// دالة مساعدة لإظهار بيانات المحاضرة بشكل منسق على سطرين
function getCourseLevelLectureLabel(group: Group) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [levels, setLevels] = useState<CourseLevel[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [coursesData, levelsData, instructorsData, sessionsData] = await Promise.all([
        api.getCourses(),
        api.getLevels(),
        api.getInstructors(),
        api.getGroupSessions(group.id)
      ]);
      setCourses(coursesData as Course[]);
      setLevels(levelsData as CourseLevel[]);
      setInstructors(instructorsData as any[]);
      setSessions(sessionsData as any[]);
    };
    fetchData();
  }, [group.id]);

  const course = courses.find(c => c.id === group.courseId);
  const level = levels.find(l => l.id === group.levelId);
  const instructor = instructors.find(i => i.id === group.instructorId);
  const lectureNumber = sessions.length + 1;
  // السطر الأول: اسم المجموعة مع كود المجموعة
  // السطر الثاني: اسم الكورس - المستوى - اسم المحاضر - رقم المحاضرة
  return (
    <span className="flex flex-col text-xs text-right whitespace-pre-line">
      <span className="font-bold text-sm">
        {group.name}
        <span className="font-mono text-xs ml-2">({group.code})</span>
      </span>
      <span>
        {course?.name || "-"}
        {level ? ` - المستوى ${level.levelNumber}` : ""}
        {instructor ? ` - ${instructor.name}` : ""}
        {` - المحاضرة ${lectureNumber}`}
      </span>
    </span>
  );
}

export default function Attendance() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [levels, setLevels] = useState<CourseLevel[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedLab, setSelectedLab] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [sessionImage, setSessionImage] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [sessionNumber, setSessionNumber] = useState(1);
  const [showEndOptions, setShowEndOptions] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [autoNewGroup, setAutoNewGroup] = useState<Group | null>(null);
  const [attendanceDialog, setAttendanceDialog] = useState<{
    open: boolean;
    group: Group | null;
    slot: string;
  }>({
    open: false,
    group: null,
    slot: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [branchesData, labsData, groupsData, studentsData, levelsData] = await Promise.all([
        api.getBranches(),
        api.getLabs(),
        api.getGroups(),
        api.getStudents(),
        api.getLevels()
      ]);
      setBranches(branchesData as Branch[]);
      setLabs(labsData as Lab[]);
      setGroups(groupsData as Group[]);
      setStudents(studentsData as Student[]);
      setLevels(levelsData as CourseLevel[]);
    };
    fetchData();
  }, []);

  const handleGroupSelect = async (group: Group) => {
    setSelectedGroup(group);
    const sessions = await api.getGroupSessions(group.id);
    setSessionNumber((sessions as any[]).length + 1);
    setShowEndOptions(false);
  };

  const handleToggleAll = (present: boolean) => {
    if (!attendanceDialog.group) return;
    const groupStudents = students.filter(s => attendanceDialog.group!.studentIds.includes(s.id));
    const att: Record<string, boolean> = {};
    groupStudents.forEach(s => { att[s.id] = present; });
    setAttendance(att);
  };

  const handleSendWhatsApp = (phones: string[], group: Group) => {
    if (phones.length === 0) return;
    // توليد رابط واتساب جماعي
    const msg = encodeURIComponent(`أنت غائب اليوم عن محاضرة المجموعة: ${group.name} (${group.code}) في الأكاديمية. إذا كان لديك عذر تواصل مع الإدارة.`);
    phones.forEach(phone => {
      window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    });
    toast.success("تم فتح رسائل واتساب للغائبين!");
  };

  const handleSaveAttendance = async () => {
    if (!attendanceDialog.group) return;
    
    const absents = Object.entries(attendance).filter(([id, v]) => !v).map(([id]) => students.find(s => s.id === id)?.mobile).filter(Boolean) as string[];
    
    // Create new session
    const sessionData = {
      groupId: attendanceDialog.group.id,
      date,
      sessionNumber,
      attendance,
      image: sessionImage
    };
    
    const newSession = await api.createSession(sessionData);
    const sessionId = (newSession as any).data.id;
    
    // Update group lectures done
    await api.updateGroup(attendanceDialog.group.id, {
      lecturesDone: (attendanceDialog.group.lecturesDone || 0) + 1
    });

    // Save attendance records
    const attendanceRecords = Object.entries(attendance).map(([sid, present]) => {
      const student = students.find(s => s.id === sid);
      return student ? {
        sessionId,
        studentId: sid,
        present,
        date
      } : null;
    }).filter(Boolean);

    await api.saveAttendance(attendanceRecords);

    handleSendWhatsApp(absents, attendanceDialog.group);

    // Check if we've reached the end of group lectures
    const lectureCount = attendanceDialog.group.lectureCount || 0;
    const currentLecture = sessionNumber;
    if (currentLecture >= lectureCount && lectureCount > 0) {
      setTimeout(() => setShowEndOptions(true), 300);
    }

    setAttendanceDialog({ open: false, group: null, slot: "" });
    setSessionImage(null);
    setAttendance({});
    toast.success("تم حفظ الحضور بنجاح!");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSessionImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEndGroup = async () => {
    if (!attendanceDialog.group) return;
    await api.updateGroup(attendanceDialog.group.id, {
      status: "finished"
    });
    toast.success("تم إنهاء المجموعة!");
    setAttendanceDialog({ open: false, group: null, slot: "" });
  };

  // const handleUpgradeAndCreateGroup  = async () => {
  //   if (!attendanceDialog.group) return;
  //   const groupLevel = levels.find(l => l.id === attendanceDialog.group!.levelId);
  //   const nextLevel = levels.find(l => l.courseId === groupLevel?.courseId && l.levelNumber === (groupLevel?.levelNumber || 0) + 1);
    
  //   if (!nextLevel) {
  //     toast.error("لا يوجد مستوى أعلى!");
  //     return;
  //   }

  //   const newGroup: Group = {
  //     ...attendanceDialog.group,
  //     id: generateId("grp-"),
  //     code: generateCode(),
  //     levelId: nextLevel.id,
  //     name: attendanceDialog.group.name.replace(groupLevel?.levelNumber?.toString() || "", nextLevel.levelNumber.toString()),
  //     startDate: "",
  //     endDate: "",
  //   };

  //   await api.createGroup(newGroup);
  //   toast.success("تم إنشاء المجموعة الجديدة وترقيتها للمستوى الأعلى!");
  //   setShowUpgradeDialog(false);
  //   setAttendanceDialog({ open: false, group: null, slot: "" });
  // };

  // نافذة إضافة مجموعة جديدة تلقائياً عند الترقية
  const handleUpgradeAndCreateGroup = () => {
    if (!attendanceDialog.group) return;
    const group = attendanceDialog.group;
    const groupLevel = levels.find(l => l.id === group.levelId);
    const courseLevels = levels.filter(l => l.courseId === group.courseId).sort((a, b) => a.levelNumber - b.levelNumber);
    const nextLevel = courseLevels.find(l => l.levelNumber === (groupLevel?.levelNumber || 0) + 1);
    if (!nextLevel) {
      toast.error("لا يوجد مستوى تالي لهذا الكورس!");
      return;
    }
    // جهز بيانات المجموعة الجديدة تلقائيًا
    const newGroup = {
      ...group,
      id: generateId("grp-"),
      code: generateCode(),
      levelId: nextLevel.id,
      name: group.name.replace(groupLevel?.levelNumber?.toString() || "", nextLevel.levelNumber.toString()),
      status: "active",
      startDate: date,
      endDate: "",
    };
    setAutoNewGroup(newGroup);
    setShowUpgradeDialog(true);
  };

  // هل تم تسجيل حضور هذه المجموعة في هذا اليوم وهذا الوقت؟
  function isSessionTaken(groupId: string, date: string, slot: string, sessions: any[]) {
      return sessions.some(s => s.date === date && s.slot === slot);
  }

  // هل وقت المجموعة الآن؟
  function getSessionStatus(slot: string, date: string) {
    const now = new Date();
    const [hour, min] = slot.split(":").map(Number);
    const slotDate = new Date(date + "T" + slot);
    const slotEnd = new Date(slotDate.getTime() + 60 * 60 * 1000); // ساعة افتراضيًا
    if (now >= slotDate && now < slotEnd) return "now";
    if (now > slotEnd) return "past";
    return "future";
  }

  // تحديد رقم المحاضرة الفعلي
  function getSessionNumber(groupId: string, sessions: any[]) {
      return sessions.length + 1;
  }

  // التحقق من نهاية المستوى
  function shouldShowEndOptions(group: Group) {
    // استخدم group.levelId مباشرة لجلب بيانات المستوى
    const groupLevel = levels.find(l => l.id === group.levelId);
    if (!groupLevel) return false;
    // عدد المحاضرات المسجلة فعلياً
    return sessions.length >= groupLevel.lectureCount;
  }

  const filteredLabs = selectedBranch ? labs.filter(l => l.branchId === selectedBranch) : [];
  // فلترة المجموعات لتظهر فقط النشطة
  const activeGroups = groups.filter(g => g.status === "active");
  const dayGroups = getDayGroups(activeGroups, date, filteredLabs);

  const handleOpenAttendanceDialog = (group: Group, slot: string) => {
    setAttendanceDialog({ open: true, group, slot });
    // تحقق هل يجب إظهار خيارات إنهاء/ترقية المجموعة
    setShowEndOptions(group ? shouldShowEndOptions(group) : false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">تسجيل الحضور</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Select
          value={selectedBranch}
          onValueChange={setSelectedBranch}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر الفرع" />
          </SelectTrigger>
          <SelectContent>
            {branches.map(branch => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedLab}
          onValueChange={setSelectedLab}
          disabled={!selectedBranch}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر المعمل" />
          </SelectTrigger>
          <SelectContent>
            {labs
              .filter(lab => lab.branchId === selectedBranch)
              .map(lab => (
                <SelectItem key={lab.id} value={lab.id}>
                  {lab.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {groups
          .filter(group => group.labId === selectedLab)
          .map(group => (
            <Card key={group.id} className="p-4">
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
                <CardDescription>{group.code}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>المستوى: {levels.find(l => l.id === group.levelId)?.name}</div>
                  <div>المحاضرات المكتملة: {group.lecturesDone || 0} من {group.lectureCount || 0}</div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => {
                    setAttendanceDialog({
                      open: true,
                      group,
                      slot: ""
                    });
                  }}
                >
                  تسجيل حضور
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>

      <Dialog open={attendanceDialog.open} onOpenChange={(open) => {
        if (!open) {
          setAttendanceDialog({ open: false, group: null, slot: "" });
          setSessionImage(null);
          setAttendance({});
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تسجيل حضور المجموعة</DialogTitle>
            <DialogDescription>
              {attendanceDialog.group && getCourseLevelLectureLabel(attendanceDialog.group)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>تاريخ المحاضرة</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <Label>رقم المحاضرة</Label>
                <Input
                  type="number"
                  value={sessionNumber}
                  onChange={(e) => setSessionNumber(parseInt(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label>صورة المحاضرة</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {sessionImage && (
                <img
                  src={sessionImage}
                  alt="صورة المحاضرة"
                  className="mt-2 max-h-40"
                />
              )}
            </div>

            <div>
              <Label>حضور الطلاب</Label>
              <div className="flex gap-2 mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleAll(true)}
                >
                  تحديد الكل حاضر
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleAll(false)}
                >
                  تحديد الكل غائب
                </Button>
              </div>
              <div className="space-y-2">
                {attendanceDialog.group && students
                  .filter(s => attendanceDialog.group!.studentIds.includes(s.id))
                  .map(student => (
                    <div key={student.id} className="flex items-center gap-2">
                      <Checkbox
                        id={student.id}
                        checked={attendance[student.id] || false}
                        onCheckedChange={(checked) => {
                          setAttendance(prev => ({
                            ...prev,
                            [student.id]: checked as boolean
                          }));
                        }}
                      />
                      <Label htmlFor={student.id}>
                        {student.name} ({student.applicationNumber})
                      </Label>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSaveAttendance}>
              حفظ الحضور
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEndOptions} onOpenChange={setShowEndOptions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>خيارات إنهاء المجموعة</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-2">
            <div className="font-bold text-center">وصلت المجموعة لعدد المحاضرات المحدد!</div>
            <Button variant="destructive" onClick={handleEndGroup}>إنهاء المجموعة فقط</Button>
            <Button variant="default" onClick={handleUpgradeAndCreateGroup}>إنهاء وإنشاء مجموعة جديدة بمستوى أعلى</Button>
            <Button variant="outline" onClick={() => setAttendanceDialog({ open: false, group: null, slot: "" })}>إضافة محاضرة إضافية للمجموعة</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper functions
function generateId(prefix: string): string {
  return `${prefix}${crypto.randomUUID()}`;
}

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
