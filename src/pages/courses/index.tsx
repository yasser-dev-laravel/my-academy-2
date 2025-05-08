import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CoursesTable from "./CoursesTable";
import CoursesForm from "./CoursesForm";
import { getByPagination, create, edit, deleteById } from "@/utils/api/coreApi";
import type { CourseGetByIdType, CourseCreateType } from "@/utils/api/coreTypes";
import { useLanguage } from "@/context/LanguageContext";

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<CourseGetByIdType[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [levels, setLevels] = useState<any[]>([]);

  // استخدم النوع الموحد فقط
  const [formData, setFormData] = useState<CourseCreateType & { categoryName?: string; applicationId?: number }>({
    id: 0,
    name: "",
    description: "",
    isActive: true,
    categoryId: 0,
    categoryName: "",
    applicationId: 0,
    levels: [
      {
        id: 0,
        name: "المستوي 1",
        description: "",
        sessionsDiortion: 0,
        price: 0,
        applicationId: "",
        sessionsCount: 0,
      },
    ],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDialog, setEditDialog] = useState({ open: false, course: null as any });
  const { language } = useLanguage();

  const translations = {
    en: {
      manageCourses: "Manage Courses",
      addCourse: "Add Course",
      editCourse: "Edit Course",
      addNewCourse: "Add New Course",
      save: "Save",
      saveChanges: "Save Changes",
    },
    ar: {
      manageCourses: "إدارة الكورسات",
      addCourse: "إضافة كورس",
      editCourse: "تعديل الكورس",
      addNewCourse: "إضافة كورس جديد",
      save: "حفظ",
      saveChanges: "حفظ التعديلات",
    },
  };

  const t = translations[language];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await getByPagination<{ data: CourseGetByIdType[] }>("Courses/pagination", { Page: 1, Limit: 100 });
        setCourses(coursesRes.data || []);
        // جلب التصنيفات
        const categoriesRes = await getByPagination<{ data: { id: number; name: string }[] }>("Categories/pagination", { Page: 1, Limit: 100 });
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error("Error fetching courses or categories:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string | number | number[]) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let newCourseId = formData.id;
      let newApplicationId = formData.applicationId;
      if (editDialog.open && editDialog.course) {
        await edit("Courses", editDialog.course.id, formData);
      } else {
        // أضف الكورس أولاً ثم حدّث applicationId
        const created = await create("Courses", { ...formData, applicationId: "" });
        newCourseId = created.id;
        newApplicationId = `${created.id}`;
        // حدّث الكورس ليأخذ applicationId الصحيح
        await edit("Courses", created.id, { ...formData, applicationId: newApplicationId });
        // حدّث مستويات الكورس ليأخذ كل مستوى applicationId خاص به
        const updatedLevels = (formData.levels || []).map((level, idx) => ({
          ...level,
          applicationId: `${newApplicationId}-L-${idx + 1}`
        }));
        await edit("Courses", created.id, { ...formData, applicationId: newApplicationId, levels: updatedLevels });
      }
      const coursesRes = await getByPagination<{ data: CourseGetByIdType[] }>("Courses/pagination", { Page: 1, Limit: 100 });
      setCourses(coursesRes.data || []);
      setIsDialogOpen(false);
      setEditDialog({ open: false, course: null });
      setFormData({ id: 0, name: "", description: "", isActive: true, categoryId: 0, categoryName: "", applicationId: 0, levels: [] });
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const handleEdit = (course: any) => {
    console.log("[EDIT COURSE] Course Data:", course, course.levels); // Log the course data
    setFormData({
      id: course.id,
      name: course.name,
      description: course.description,
      isActive: course.isActive,
      categoryId: course.categoryId,
      categoryName: course.categoryName || "",
      applicationId: course.applicationId || 0,
      levels: course.levels,
    });
    setEditDialog({ open: true, course });
    setIsDialogOpen(true); // Ensure the dialog opens when editing
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteById("Courses", id);
      const coursesRes = await getByPagination<{ data: CourseGetByIdType[] }>("Courses/pagination", { Page: 1, Limit: 100 });
      setCourses(coursesRes.data || []);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{t.manageCourses}</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                // حساب أعلى id
                const maxId = courses.length > 0 ? Math.max(...courses.map(c => Number(c.id) || 0)) : 0;
                setFormData({
                  id: 0,
                  name: "",
                  description: "",
                  isActive: true,
                  categoryId: 0,
                  categoryName: "",
                  applicationId: `c-${maxId + 1}`,
                  levels: [
                    {
                      id: 0,
                      name: "المستوي 1",
                      description: "",
                      sessionsDiortion: 0,
                      price: 0,
                      applicationId: "",
                      sessionsCount: 0,
                    },
                  ],
                });
                setIsDialogOpen(true);
                setEditDialog({ open: false, course: null });
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> {t.addCourse}
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby="dialog-description">
            <DialogHeader>
              <DialogTitle>{editDialog.open ? t.editCourse : t.addNewCourse}</DialogTitle>
              <p id="dialog-description" className="text-sm text-muted-foreground">
                {editDialog.open ? "قم بتعديل بيانات الكورس" : "قم بإضافة بيانات الكورس الجديد"}
              </p>
            </DialogHeader>
            <CoursesForm
              values={formData}
              categories={categories}
              levels={levels}
              onChange={handleChange}
              onSelectChange={handleSelectChange}
              onSubmit={handleSubmit}
              submitLabel={editDialog.open ? t.saveChanges : t.save}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditDialog({ open: false, course: null });
                setFormData({ id: 0, name: "", description: "", isActive: true, categoryId: 0, categoryName: "", applicationId: 0, levels: [] });
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <CoursesTable courses={courses} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default Courses;