import React from "react";
import { useState, useEffect } from "react";
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getBranchesPaginated } from "@/utils/api/branches";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import StudentReceipts from "@/components/StudentReceipts";
import { getStudentsPaginated, createStudent } from "@/utils/api/students";
import { Branch, Course } from "@/utils/mockData";

interface Student {
  id: string; // رقم الأبليكيشن
  password: string;
  name: string;
  mobile: string;
  whatsapp: string;
  birthDate: string;
  qualification: string;
  gender: string;
  address: string;
  guardian: {
    name: string;
    type: string;
    mobile: string;
  };
  groups: StudentGroupEnrollment[];
}

interface StudentGroupEnrollment {
  groupId: string;
  groupName: string;
  courseName: string;
  branchName: string;
  status: string;
  paid: number;
  remaining: number;
}

function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string>("__all__");
  const [selectedCourse, setSelectedCourse] = useState<string>("__all__");
  const [selectedStudent, setSelectedStudent] = useState<Student|null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: "",
    mobile: "",
    whatsapp: "",
    birthDate: "",
    qualification: "",
    gender: "ذكر",
    address: "",
    guardian: { name: "", type: "الأب", mobile: "" },
    groups: [],
  });
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchBranchesAndStudents() {
      try {
        const res = await getBranchesPaginated({ Page: 1, Limit: 100 });
        const mappedBranches = Array.isArray(res.data)
          ? res.data.filter(b => b && typeof b.id !== 'undefined' && (typeof b.name === 'string' && b.name.trim() !== ''))
            .map((b: any) => ({
              id: String(b.id),
              name: b.name || '',
              code: b.code || '',
              governorate: b.areaName || '',
            }))
          : [];
        setBranches(mappedBranches);

        // const rawCourses = getFromLocalStorage<Course[]>("latin_academy_courses", []);
        // const validCourses = Array.isArray(rawCourses) ? rawCourses.filter(c => c && typeof c.id === 'string' && c.id.trim() !== '' && typeof c.name === 'string' && c.name.trim() !== '') : [];
        // setCourses(validCourses);
        setCourses([]); // مؤقتاً حتى يتم ربط جلب الكورسات من API

        // const studentsArrRaw = getFromLocalStorage<Student[]>("latin_academy_students", []);
        // let fixed = false;
        // const allGroups = getFromLocalStorage<any[]>("latin_academy_groups", []);
        // const allCourses = validCourses;
        // const allBranches = mappedBranches;
        // const studentsArr = Array.isArray(studentsArrRaw) ? studentsArrRaw.filter(s => s && typeof s === 'object').map(s => {
        //   ... معالجة بيانات الطلاب ...
        // }) : [];
        // setStudents(studentsArr);
        // if (fixed) {
        //   saveToLocalStorage("latin_academy_students", studentsArr);
        // }
        // === جلب الطلاب من الـ API ===
        const studentsRes = await getStudentsPaginated({ Page: 1, Limit: 100 });
        setStudents(Array.isArray(studentsRes.data) ? studentsRes.data.map((dto: any) => ({
  id: String(dto.id),
  password: '', // قيمة افتراضية
  name: dto.name || '',
  mobile: dto.phone || '',
  whatsapp: '', // قيمة افتراضية
  birthDate: dto.birthDate || '',
  qualification: '', // قيمة افتراضية
  gender: dto.genderId === 2 ? 'أنثى' : 'ذكر',
  address: dto.address || '',
  guardian: {
    name: '', // قيمة افتراضية
    type: 'الأب', // قيمة افتراضية
    mobile: dto.parentPhone || '',
  },
  groups: [], // قيمة افتراضية (فارغة)
})) : []);
      } catch (error) {
        setBranches([]);
        setCourses([]);
        setStudents([]);
      }
    }
    fetchBranchesAndStudents();
  }, []);

  // فلترة الطلاب
  const filteredStudents = Array.isArray(students) ? students.filter(s => {
    if (!s) return false;
    const matchesBranch = selectedBranch && selectedBranch !== "__all__" ? s.groups && s.groups.some(g => g && g.branchName === branches.find(b => b.id === selectedBranch)?.name) : true;
    const matchesCourse = selectedCourse && selectedCourse !== "__all__" ? s.groups && s.groups.some(g => g && g.courseName === courses.find(c => c.id === selectedCourse)?.name) : true;
    const matchesSearch =
      (s.name && s.name.includes(searchTerm)) ||
      (s.mobile && s.mobile.includes(searchTerm)) ||
      (s.id && s.id.includes(searchTerm));
    return matchesBranch && matchesCourse && matchesSearch;
  }) : [];

  // ... (rest of Students component JSX rendering)

  // توليد باسورد عشوائي
  function randomPassword(length = 6) {
    return Math.random().toString(36).slice(-length);
  }

  function generateStudentId(studentsArr: any[]): string {
    // رقم السنة الحالي (آخر رقمين)
    const now = new Date();
    const year = now.getFullYear() % 100;
    // استخراج كل الطلاب بنفس السنة
    const prefix = `std-${year}`;
    const yearStudents = studentsArr.filter(s => typeof s.id === 'string' && s.id.startsWith(prefix));
    // إيجاد أعلى رقم تسلسلي
    let maxNum = 1000;
    yearStudents.forEach(s => {
      const m = s.id.match(/^std-(\d{2})(\d{4,})$/);
      if (m && m[2]) {
        const num = parseInt(m[2], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `std-${year}${maxNum + 1}`;
  }

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.mobile) {
      toast({ title: "يرجى إدخال اسم الطالب والموبايل", variant: "destructive" });
      return;
    }
    try {
      // Prepare the payload for the API
      const payload = {
        name: newStudent.name,
        phone: newStudent.mobile,
        birthDate: newStudent.birthDate || null,
        genderId: newStudent.gender === 'أنثى' ? 2 : 1,
        address: newStudent.address || null,
        parentPhone: newStudent.guardian?.mobile || null,
        notes: null,
      };
      // Call the API to create the student
      await createStudent(payload);
      // Refetch students from the API
      const studentsRes = await getStudentsPaginated({ Page: 1, Limit: 100 });
      setStudents(Array.isArray(studentsRes.data) ? studentsRes.data.map((dto: any) => ({
        id: String(dto.id),
        password: '',
        name: dto.name || '',
        mobile: dto.phone || '',
        whatsapp: '',
        birthDate: dto.birthDate || '',
        qualification: '',
        gender: dto.genderId === 2 ? 'أنثى' : 'ذكر',
        address: dto.address || '',
        guardian: {
          name: '',
          type: 'الأب',
          mobile: dto.parentPhone || '',
        },
        groups: [],
      })) : []);
      setIsDialogOpen(false);
      setNewStudent({
        name: "",
        mobile: "",
        whatsapp: "",
        birthDate: "",
        qualification: "",
        gender: "ذكر",
        address: "",
        guardian: { name: "", type: "الأب", mobile: "" },
        groups: [],
      });
      toast({ title: "تم إضافة الطالب بنجاح" });
    } catch (error) {
      toast({ title: "حدث خطأ أثناء إضافة الطالب", variant: "destructive" });
    }
  };

  const handleStudentRowClick = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentDialog(true);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4 md:mb-0">الطلاب / الدارسين</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث بالاسم أو الموبايل أو رقم الأبليكيشن"
              className="pr-8"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <Select onValueChange={setSelectedBranch} value={selectedBranch}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر الفرع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">كل الفروع</SelectItem>
                {branches.filter(b => !!b && typeof b.id === 'string' && !!b.id && typeof b.name === 'string' && !!b.name).map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-64">
            <Select onValueChange={setSelectedCourse} value={selectedCourse}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر الكورس" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">كل الكورسات</SelectItem>
                {courses.filter(c => !!c && typeof c.id === 'string' && !!c.id && typeof c.name === 'string' && !!c.name).map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">إضافة طالب جديد</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة طالب جديد</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddStudent} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>اسم الطالب *</Label>
                    <Input value={newStudent.name} onChange={e => setNewStudent({ ...newStudent, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label>رقم الموبايل *</Label>
                    <Input value={newStudent.mobile} onChange={e => setNewStudent({ ...newStudent, mobile: e.target.value })} required />
                  </div>
                  <div>
                    <Label>رقم الواتساب</Label>
                    <Input value={newStudent.whatsapp} onChange={e => setNewStudent({ ...newStudent, whatsapp: e.target.value })} />
                  </div>
                  <div>
                    <Label>تاريخ الميلاد</Label>
                    <Input type="date" value={newStudent.birthDate} onChange={e => setNewStudent({ ...newStudent, birthDate: e.target.value })} />
                  </div>
                  <div>
                    <Label>المؤهل</Label>
                    <Input value={newStudent.qualification} onChange={e => setNewStudent({ ...newStudent, qualification: e.target.value })} />
                  </div>
                  <div>
                    <Label>النوع</Label>
                    <Select value={newStudent.gender || "ذكر"} onValueChange={v => setNewStudent({ ...newStudent, gender: v })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ذكر">ذكر</SelectItem>
                        <SelectItem value="أنثى">أنثى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>العنوان</Label>
                    <Input value={newStudent.address} onChange={e => setNewStudent({ ...newStudent, address: e.target.value })} />
                  </div>
                  <div>
                    <Label>اسم ولي الأمر</Label>
                    <Input value={newStudent.guardian?.name || ""} onChange={e => setNewStudent({ ...newStudent, guardian: { ...newStudent.guardian!, name: e.target.value } })} />
                  </div>
                  <div>
                    <Label>نوع ولي الأمر</Label>
                    <Select value={newStudent.guardian?.type || "الأب"} onValueChange={v => setNewStudent({ ...newStudent, guardian: { ...newStudent.guardian!, type: v } })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="نوع ولي الأمر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="الأب">الأب</SelectItem>
                        <SelectItem value="الأم">الأم</SelectItem>
                        <SelectItem value="أخرى">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>موبايل ولي الأمر</Label>
                    <Input value={newStudent.guardian?.mobile || ""} onChange={e => setNewStudent({ ...newStudent, guardian: { ...newStudent.guardian!, mobile: e.target.value } })} />
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
                  <Button type="submit">حفظ الطالب</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>جدول الطلاب</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الأبليكيشن</TableHead>
                <TableHead>اسم الطالب</TableHead>
                <TableHead>الموبايل</TableHead>
                <TableHead>الفرع</TableHead>
                <TableHead>الكورسات</TableHead>
                <TableHead>المجموعات المسجل بها</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(filteredStudents) && filteredStudents.map(student => (
                <TableRow key={student.id} onClick={() => handleStudentRowClick(student)} className="cursor-pointer">
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.mobile}</TableCell>
                  <TableCell>{Array.isArray(student.groups) ? student.groups.map(g => g && g.branchName).join(", ") : ""}</TableCell>
                  <TableCell>{Array.isArray(student.groups) ? student.groups.map(g => g && g.courseName).join(", ") : ""}</TableCell>
                  <TableCell>
                    {Array.isArray(student.groups) && student.groups.length
                      ? student.groups.map(g => g && (g.groupName || g.groupId)).join(", ")
                      : <span className="text-gray-400">لا يوجد</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* نافذة بيانات الطالب */}
      <Dialog open={showStudentDialog} onOpenChange={setShowStudentDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>بيانات الطالب</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>رقم الأبليكيشن:</Label> {selectedStudent.id}<br />
                  <Label>اسم الطالب:</Label> {selectedStudent.name}<br />
                  <Label>الموبايل:</Label> {selectedStudent.mobile}<br />
                  <Label>واتساب:</Label> {selectedStudent.whatsapp}<br />
                  <Label>تاريخ الميلاد:</Label> {selectedStudent.birthDate}<br />
                  <Label>المؤهل:</Label> {selectedStudent.qualification}<br />
                  <Label>النوع:</Label> {selectedStudent.gender}<br />
                  <Label>العنوان:</Label> {selectedStudent.address}<br />
                  <Label>اسم ولي الأمر:</Label> {selectedStudent.guardian.name}<br />
                  <Label>نوع ولي الأمر:</Label> {selectedStudent.guardian.type}<br />
                  <Label>موبايل ولي الأمر:</Label> {selectedStudent.guardian.mobile}<br />
                </div>
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المجموعة</TableHead>
                        <TableHead>الدورة</TableHead>
                        <TableHead>الفرع</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>المدفوع</TableHead>
                        <TableHead>المتبقي</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.isArray(selectedStudent.groups) && selectedStudent.groups.map(g => (
                        <TableRow key={g.groupId}>
                          <TableCell>{g.groupName || g.groupId}</TableCell>
                          <TableCell>{g.courseName}</TableCell>
                          <TableCell>{g.branchName}</TableCell>
                          <TableCell>{g.status}</TableCell>
                          <TableCell>{g.paid}</TableCell>
                          <TableCell>{g.remaining}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              {/* إيصالات الطالب */}
              <div>
                <h3 className="font-bold mb-2">إيصالات الطالب</h3>
                <StudentReceipts studentId={selectedStudent.id} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Students;
