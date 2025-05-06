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
  const [categories, setCategories] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  interface CreateCourseDto {
    name: string;
    description: string;
    isActive: boolean;
    categoryId: number;
    levels: {
      name: string;
      description: string;
      price: number;
      sessionsCount: number;
    }[];
  }

  const [formData, setFormData] = useState<CreateCourseDto & { categoryName: string; applicationId: number }>({
    name: "",
    description: "",
    isActive: true,
    categoryId: 0,
    categoryName: "",
    applicationId: 0,
    levels: [
      {
        name: "المستوي 1",
        description: "",
        price: 0,
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
      } catch (error) {
        console.error("Error fetching courses:", error);
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
    console.log("[SUBMIT] Form data:", formData);
    try {
      if (editDialog.open && editDialog.course) {
        await edit("Courses", editDialog.course.id, formData);
      } else {
        await create("Courses", formData);
      }
      const coursesRes = await getByPagination<{ data: CourseGetByIdType[] }>("Courses/pagination", { Page: 1, Limit: 100 });
      setCourses(coursesRes.data || []);
      setIsDialogOpen(false);
      setEditDialog({ open: false, course: null });
      setFormData({ name: "", description: "", isActive: true, categoryId: 0, categoryName: "", applicationId: 0, levels: [] });
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const handleEdit = (course: any) => {
    console.log("[EDIT COURSE] Course Data:", course, course.levels); // Log the course data
    setFormData({
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
            <Button>
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
                setFormData({ name: "", description: "", isActive: true, categoryId: 0, categoryName: "", applicationId: 0, levels: [] });
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