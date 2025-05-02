import { useState, useEffect } from "react";

import type { CourseLevel } from "./types";
// Temporary Course interface definition for typing
interface Course {
  id: string;
  name: string;
  code?: string;
  description?: string;
  categoryId?: string;
  levels?: any[];
  // Add other fields as needed
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getCoursesPaginated, createCourse, deleteCourse } from "@/utils/api/courses";
import { getCategoriesPaginated } from "@/utils/api/categories";
import { BookOpen, Layers, Plus, Search, Trash, Pencil, ChevronDown, ChevronRight, Clock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ConfirmDialog from "@/components/ConfirmDialog";

const Courses = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFormData, setCourseFormData] = useState<Partial<any>>({
    name: "",
    description: "",
    categoryId: "",
    levels: [],
  });
  const [levelFormData, setLevelFormData] = useState<any>({
    courseId: "",
    levelNumber: 1,
    lectureCount: 0,
    lectureDuration: 0,
    price: 0,
  });
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [isLevelDialogOpen, setIsLevelDialogOpen] = useState(false);
  const [editCourseId, setEditCourseId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteCourse, setPendingDeleteCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchCoursesAndCategories() {
      try {
        const coursesRes = await getCoursesPaginated({ Page: 1, Limit: 100 });
        setCourses(coursesRes.data || []);
        const categoriesRes = await getCategoriesPaginated({ Page: 1, Limit: 100 });
        setCategories(categoriesRes.data || []);
      } catch (error) {
        setCourses([]);
        setCategories([]);
        toast({ title: "خطأ في تحميل الكورسات أو التصنيفات", description: "تعذر جلب البيانات من الخادم", variant: "destructive" });
      }
    }
    fetchCoursesAndCategories();
  }, []);

  useEffect(() => {
    if (isCourseDialogOpen && (!courseFormData.levels || courseFormData.levels.length === 0)) {
      setCourseFormData((prev) => ({
        ...prev,
        levels: [
          {
            id: '',
            code: (prev.code ||  courses.length + 1) + "-1",
            courseName: prev.name || "",
            levelNumber: 1,
            lectureCount: 0,
            lectureDuration: 0,
            price: 0,
          },
        ],
      }));
    }
    if (!isCourseDialogOpen) {
      setCourseFormData((prev) => ({ ...prev, levels: [] }));
    }
    // eslint-disable-next-line
  }, [isCourseDialogOpen]);

  useEffect(() => {
    if (!isCourseDialogOpen) {
      setEditCourseId(null);
    }
  }, [isCourseDialogOpen]);

  const filteredCourses = courses.filter(
    (course) => 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      course.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCourseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "number") {
      setCourseFormData({ ...courseFormData, [name]: parseFloat(value) });
    } else {
      setCourseFormData({ ...courseFormData, [name]: value });
    }
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "number") {
      setLevelFormData({ ...levelFormData, [name]: parseFloat(value) });
    } else {
      setLevelFormData({ ...levelFormData, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setCourseFormData({ ...courseFormData, [name]: value });
  };

  const totalCoursePrice = (courseFormData.levels || []).reduce((sum, lvl) => sum + (parseFloat(String(lvl.price)) || 0), 0);
  const totalCourseDuration = (courseFormData.levels || []).reduce((sum, lvl) => sum + ((parseInt(String(lvl.lectureCount)) || 0) * (parseInt(String(lvl.lectureDuration)) || 0)), 0);

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseFormData.name || !courseFormData.categoryId) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCourse({
        name: courseFormData.name,
        description: courseFormData.description,
        categoryId: Number(courseFormData.categoryId),
        levels: (courseFormData.levels || []).map((lvl: any) => lvl.levelNumber),
      });
      toast({ title: "تم بنجاح", description: "تم إضافة الكورس بنجاح" });
      setIsCourseDialogOpen(false);
      setCourseFormData({ name: "", description: "", categoryId: "", levels: [] });
      // Refetch courses
      const coursesRes = await getCoursesPaginated({ Page: 1, Limit: 100 });
      setCourses(coursesRes.data || []);
    } catch (error) {
      toast({ title: "خطأ في الإضافة", description: "تعذر إضافة الكورس", variant: "destructive" });
    }
  };

  const handleLevelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!levelFormData.courseId || !levelFormData.lectureCount || !levelFormData.lectureDuration) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    
    const courseIndex = courses.findIndex((course) => course.id === levelFormData.courseId);
    
    if (courseIndex === -1) {
      toast({
        title: "خطأ",
        description: "الكورس غير موجود",
        variant: "destructive",
      });
      return;
    }
    
    const course = courses[courseIndex];
    
    const levelNumber = levelFormData.levelNumber || course.levels.length + 1;
    
    const levelCode = `${course.code}-${levelNumber}`;
    
    const newLevel: CourseLevel = {
      id: '',
      price: levelFormData.price || 0,
    };
    
    const updatedLevels = [...course.levels, newLevel];
    
    const totalDuration = updatedLevels.reduce(
      (sum, level) => sum + (level.lectureCount * level.lectureDuration),
      0
    );
    
    const totalPrice = updatedLevels.reduce(
      (sum, level) => sum + level.price,
      0
    );
    
    const updatedCourse = {
      ...course,
      levels: updatedLevels,
      totalDuration,
      totalPrice,
    };
    
    const updatedCourses = [...courses];
    updatedCourses[courseIndex] = updatedCourse;
    
    setCourses(updatedCourses);
    
    setLevelFormData({
      courseId: "",
      levelNumber: 1,
      lectureCount: 0,
      lectureDuration: 0,
      price: 0,
    });
    setIsLevelDialogOpen(false);
    
    toast({
      title: "تم بنجاح",
      description: "تم إضافة المستوى بنجاح",
    });
  };

  const handleAskDeleteCourse = (course: Course) => {
    setPendingDeleteCourse(course);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteCourse = async () => {
    if (!pendingDeleteCourse) return;
    try {
      await deleteCourse(Number(pendingDeleteCourse.id));
      toast({ title: "تم حذف الكورس بنجاح" });
      setDeleteDialogOpen(false);
      setPendingDeleteCourse(null);
      // Refetch courses
      const coursesRes = await getCoursesPaginated({ Page: 1, Limit: 100 });
      setCourses(coursesRes.data || []);
    } catch (error) {
      toast({ title: "خطأ في الحذف", description: "تعذر حذف الكورس", variant: "destructive" });
    }
  };

  const handleAddLevelInCourse = () => {
    const currentLevels = courseFormData.levels || [];
    const nextNumber = currentLevels.length + 1;
    const newLevel = {
      id: '',
      levelNumber: nextNumber,
      lectureCount: 0,
      lectureDuration: 0,
      price: 0,
    };
    setCourseFormData({
      ...courseFormData,
      levels: [...currentLevels, newLevel],
    });
  };

  const handleCourseLevelChange = (idx: number, field: string, value: any) => {
    const updatedLevels = [...(courseFormData.levels || [])];
    updatedLevels[idx] = { ...updatedLevels[idx], [field]: value };
    setCourseFormData({ ...courseFormData, levels: updatedLevels });
  };

  const handleEditCourse = (course: Course) => {
    setEditCourseId(course.id);
    setCourseFormData({ ...course });
    setIsCourseDialogOpen(true);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4 md:mb-0">إدارة الكورسات</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن كورس..."
              className="pr-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="h-4 w-4 ml-2" />
                إضافة كورس
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editCourseId ? "تعديل الكورس" : "إضافة كورس جديد"}</DialogTitle>
                <DialogDescription>
                  أدخل بيانات الكورس الجديد.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCourseSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم الكورس *</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={courseFormData.name}
                      onChange={handleCourseChange}
                      placeholder="مثال: اللغة الإنجليزية للمبتدئين"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">وصف الكورس</Label>
                    <Textarea 
                      id="description"
                      name="description"
                      value={courseFormData.description}
                      onChange={handleCourseChange}
                      placeholder="وصف مختصر للكورس"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Select 
                      name="categoryId"
                      value={courseFormData.categoryId}
                      onValueChange={(value) => handleSelectChange("categoryId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">المستويات</Label>
                      <Button type="button" size="sm" variant="outline" onClick={handleAddLevelInCourse}>
                        <Plus className="h-4 w-4 ml-1" /> <span className="text-xs">إضافة مستوى</span>
                      </Button>
                    </div>
                    <div className="flex gap-4 mb-3 text-xs">
                      <div className="font-semibold">اجمالي السعر: <span className="text-blue-700">{totalCoursePrice}</span> جنيه</div>
                      <div className="font-semibold">اجمالي الساعات: <span className="text-blue-700">{totalCourseDuration}</span> ساعة</div>
                    </div>
                    <div className="overflow-x-auto">
                      <div className="flex gap-2 mb-1 px-1 text-[11px] font-bold text-gray-600">
                        <div className="w-24 text-center">اسم المستوى</div>
                        <div className="w-20 text-center">سعر</div>
                        <div className="w-20 text-center">عدد المحاضرات</div>
                        <div className="w-20 text-center">مدة المحاضرة</div>
                        <div className="w-14 text-center">إجراء</div>
                      </div>
                      <div className="max-h-48 overflow-y-auto pr-1">
                        {(courseFormData.levels || []).map((level, idx) => (
                          <div key={level.id} className="flex gap-2 mb-1 items-center">
                            <Input
                              className="w-24 h-8 text-xs px-2"
                              value={`المستوى ${level.levelNumber}`}
                              disabled
                              readOnly
                              placeholder="اسم المستوى"
                            />
                            <Input
                              className="w-20 h-8 text-xs px-2"
                              value={level.price}
                              type="number"
                              min={0}
                              onChange={e => handleCourseLevelChange(idx, "price", parseFloat(e.target.value))}
                              placeholder="سعر المستوى"
                            />
                            <Input
                              className="w-20 h-8 text-xs px-2"
                              value={level.lectureCount}
                              type="number"
                              min={0}
                              onChange={e => handleCourseLevelChange(idx, "lectureCount", parseInt(e.target.value))}
                              placeholder="عدد المحاضرات"
                            />
                            <Input
                              className="w-20 h-8 text-xs px-2"
                              value={level.lectureDuration}
                              type="number"
                              min={0}
                              onChange={e => handleCourseLevelChange(idx, "lectureDuration", parseInt(e.target.value))}
                              placeholder="مدة المحاضرة"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="w-7 h-7"
                              onClick={() => {
                                const updatedLevels = [...(courseFormData.levels || [])];
                                updatedLevels.splice(idx, 1);
                                setCourseFormData({ ...courseFormData, levels: updatedLevels });
                              }}
                              title="حذف المستوى"
                            >
                              <Trash className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCourseDialogOpen(false)}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit">حفظ</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="space-y-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle>{course.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditCourse(course)}
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAskDeleteCourse(course)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <div className="text-xs flex items-center">
                      <span className="font-medium ml-1">التصنيف:</span> {categories.find((cat:any) => cat.id === course.categoryId)?.name || "غير معروف"}
                    </div>
                    <div className="text-xs flex items-center">
                      <span className="font-medium ml-1">المدة الإجمالية:</span> {course.totalDuration} ساعة
                    </div>
                    <div className="text-xs flex items-center">
                      <span className="font-medium ml-1">السعر الإجمالي:</span> {course.totalPrice} جنيه
                    </div>
                  </div>
                  {course.description && (
                    <p className="mt-2 text-sm">{course.description}</p>
                  )}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-1">
                <Accordion type="single" collapsible>
                  <AccordionItem value="levels">
                    <AccordionTrigger className="text-sm font-medium py-2">
                      المستويات ({course.levels.length})
                    </AccordionTrigger>
                    <AccordionContent>
                      {course.levels.length > 0 ? (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>الكود</TableHead>
                                <TableHead>المستوى</TableHead>
                                <TableHead>عدد المحاضرات</TableHead>
                                <TableHead>مدة المحاضرة</TableHead>
                                <TableHead>السعر</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {course.levels.map((level) => (
                                <TableRow key={level.id}>
                                  <TableCell className="font-medium">{level.code}</TableCell>
                                  <TableCell>المستوى {level.levelNumber}</TableCell>
                                  <TableCell>{level.lectureCount} محاضرة</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3 text-muted-foreground" />
                                      <span>{level.lectureDuration} ساعة</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>{level.price} جنيه</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center p-4 text-muted-foreground">
                          لا توجد مستويات لهذا الكورس
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            لم يتم العثور على كورسات. قم بإضافة كورسات جديدة.
          </CardContent>
        </Card>
      )}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="تأكيد حذف الكورس"
        description={pendingDeleteCourse ? `هل أنت متأكد أنك تريد حذف الكورس (${pendingDeleteCourse.name})؟` : ""}
        onConfirm={handleConfirmDeleteCourse}
        onCancel={() => { setDeleteDialogOpen(false); setPendingDeleteCourse(null); }}
        confirmText="حذف"
        cancelText="إلغاء"
      />
    </div>
  );
};

export default Courses;
