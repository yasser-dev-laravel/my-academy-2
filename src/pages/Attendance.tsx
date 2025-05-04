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
import { getBranchesPaginated } from "@/utils/api/branches";
import { getHelpTableRoom } from "@/utils/api/helpTables";

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

interface Room {
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

function getDayGroups(groups: Group[], date: string, rooms: Room[]) {
  const result: Record<string, Record<string, Group | null>> = {};
  rooms.forEach(room => {
    result[room.id] = {};
    TIME_SLOTS.forEach(slot => {
      result[room.id][slot] = groups.find(g => g.labId === room.id && g.startTime === slot && g.weeklyDays.includes(getArabicDayName(new Date(date).getDay())) && g.startDate <= date && g.endDate >= date) || null;
    });
  });
  return result;
}

export function getArabicDayName(day: number) {
  return ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"][day];
}

function CourseLevelLectureLabel({ group }: { group: Group }) {
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
  const [rooms, setRooms] = useState<Room[]>([]);
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
      const branchesRes = await getBranchesPaginated({ Page: 1, Limit: 100 });
      const mappedBranches = Array.isArray(branchesRes.data)
        ? branchesRes.data.map((b: any) => ({
            id: String(b.id),
            name: b.name || '',
            code: b.code || '',
            governorate: b.areaName || '',
          }))
        : [];
      setBranches(mappedBranches);
      const [roomsRes, groupsData, studentsData, levelsData] = await Promise.all([
        getHelpTableRoom(),
        api.getGroups(),
        api.getStudents(),
        api.getLevels()
      ]);
      const roomsData = Array.isArray(roomsRes.data)
        ? roomsRes.data.map((r: any) => ({
            id: String(r.id),
            name: r.name,
            branchId: String(r.branchId)
          }))
        : [];
      setRooms(roomsData);
      setGroups(groupsData as Group[]);
      setStudents(studentsData as Student[]);
      setLevels(levelsData as CourseLevel[]);
      console.log('selectedBranch:', selectedBranch);
      console.log('rooms:', roomsData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      getHelpTableRoom().then((roomsRes) => {
        const roomsData = Array.isArray(roomsRes.data)
          ? roomsRes.data.map((r: any) => ({
              id: String(r.id),
              name: r.name,
              branchId: String(r.branchId)
            }))
          : [];
        const filtered = roomsData.filter(r => r.branchId === selectedBranch);
        setRooms(filtered);
      });
    } else {
      setRooms([]);
    }
  }, [selectedBranch]);

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
    const msg = encodeURIComponent(`أنت غائب اليوم عن محاضرة المجموعة: ${group.name} (${group.code}) في الأكاديمية. إذا كان لديك عذر تواصل مع الإدارة.`);
    phones.forEach(phone => {
      window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    });
    toast.success("تم فتح رسائل واتساب للغائبين!");
  };

  const handleSaveAttendance = async () => {
    if (!attendanceDialog.group) return;
    
    const absents = Object.entries(attendance).filter(([id, v]) => !v).map(([id]) => students.find(s => s.id === id)?.mobile).filter(Boolean) as string[];
    
    const sessionData = {
      groupId: attendanceDialog.group.id,
      date,
      sessionNumber,
      attendance,
      image: sessionImage
    };
    
    const newSession = await api.createSession(sessionData);
    const sessionId = (newSession as any).data.id;
    
    await api.updateGroup(attendanceDialog.group.id, {
      lecturesDone: (attendanceDialog.group.lecturesDone || 0) + 1
    });

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

  function isSessionTaken(groupId: string, date: string, slot: string, sessions: any[]) {
      return sessions.some(s => s.date === date && s.slot === slot);
  }

  function getSessionStatus(slot: string, date: string) {
    const now = new Date();
    const [hour, min] = slot.split(":").map(Number);
    const slotDate = new Date(date + "T" + slot);
    const slotEnd = new Date(slotDate.getTime() + 60 * 60 * 1000);
    if (now >= slotDate && now < slotEnd) return "now";
    if (now > slotEnd) return "past";
    return "future";
  }

  function getSessionNumber(groupId: string, sessions: any[]) {
      return sessions.length + 1;
  }

  function shouldShowEndOptions(group: Group, sessions: any[]) {
    const groupLevel = levels.find(l => l.id === group.levelId);
    if (!groupLevel) return false;
    return sessions.length >= groupLevel.lectureCount;
  }

  const filteredRooms = selectedBranch ? rooms.filter(r => String(r.branchId) === String(selectedBranch)) : [];

  const filteredGroups = groups.filter(
    g => g.status === "active" && filteredRooms.some(room => room.id === g.labId)
  );

  function findGroupAtSlot(roomId: string, slot: string) {
    return filteredGroups.find(g =>
      g.labId === roomId &&
      g.startTime === slot &&
      g.weeklyDays.includes(getArabicDayName(new Date(date).getDay())) &&
      g.startDate <= date &&
      g.endDate >= date
    );
  }

  const handleOpenAttendanceDialog = async (group: Group, slot: string) => {
    setAttendanceDialog({ open: true, group, slot });
    if (group) {
      const groupSessions = await api.getGroupSessions(group.id);
      setShowEndOptions(shouldShowEndOptions(group, groupSessions as any[]));
    } else {
      setShowEndOptions(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">تسجيل الحضور</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label>تاريخ اليوم</Label>
          <Input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div>
          <Label>الفرع</Label>
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
        </div>
      </div>

      {!selectedBranch ? (
        <div className="text-center text-muted-foreground py-12">يرجى اختيار الفرع لعرض القاعات والمجموعات.</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الوقت</TableHead>
                {filteredRooms.length > 0 ? (
                  filteredRooms.map(room => (
                    <TableHead key={room.id}>{room.name}</TableHead>
                  ))
                ) : (
                  <TableHead colSpan={1} className="text-center text-muted-foreground">لا توجد قاعات لهذا الفرع</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {TIME_SLOTS.map(slot => (
                <TableRow key={slot}>
                  <TableCell>{slot}</TableCell>
                  {filteredRooms.length > 0 && filteredRooms.map(room => {
                    const group = findGroupAtSlot(room.id, slot);
                    return (
                      <TableCell key={room.id}>
                        {group ? (
                          <Button variant="link" onClick={() => handleOpenAttendanceDialog(group, slot)}>
                            {group.name}
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

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
              {attendanceDialog.group && <CourseLevelLectureLabel group={attendanceDialog.group} />}
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

function generateId(prefix: string): string {
  return `${prefix}${crypto.randomUUID()}`;
}

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
