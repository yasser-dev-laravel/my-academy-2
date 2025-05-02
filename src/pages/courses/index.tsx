import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CoursesTable from "./CoursesTable";
import CoursesForm from "./CoursesForm";
import { getCoursesPaginated, createCourse, updateCourse, deleteCourse } from "@/utils/api/courses";
import { getHelpTableCategory } from "@/utils/api/helpTables";
import { useLanguage } from "@/context/LanguageContext";

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [levels, setLevels] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    categoryId: null,
    id: null,
    isActive: false,
    categoryName: "",
    applicationId: null,
    levels: {
      id: null,
      name: "",
      description: "",
      price: null,
      sessionsCount: null,
    }
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
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [coursesRes, categoriesRes] = await Promise.all([
        getCoursesPaginated({ Page: 1, Limit: 100 }),
        getHelpTableCategory(),
      ]);
      console.log("[FETCH COURSES] Response:", coursesRes); // Log the response
      setCourses(coursesRes.data || []);
      setCategories((categoriesRes.data as any[]) || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
      if (editDialog.open && editDialog.course) {
        await updateCourse(editDialog.course.id, formData);
      } else {
        await createCourse(formData);
      }
      fetchAll();
      setIsDialogOpen(false);
      setEditDialog({ open: false, course: null });
      setFormData({ name: "", description: "", categoryId: null, levels: [] });
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const handleEdit = (course: any) => {
    setFormData({
      name: course.name,
      description: course.description,
      categoryId: course.categoryId,
      levels: course.levels,
    });
    setEditDialog({ open: true, course });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCourse(id);
      fetchAll();
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
                setFormData({ name: "", description: "", categoryId: null, levels: [] });
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