import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import InstructorsTable from "./InstructorsTable";
import InstructorForm from "./InstructorForm";
import { getByPagination, create, edit, deleteById  } from "@/utils/api/coreApi";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

const InstructorsPage = () => {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    address: "",
    nationalId: "",
    cityId: 0,
    salary: 0,
    salaryTypeId: 0,
    coursesIds: [],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDialog, setEditDialog] = useState({ open: false, instructor: null as any });
  const { toast } = useToast();

  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [salaryTypes, setSalaryTypes] = useState<{ id: number; type: string }[]>([]);
  const [courses, setCourses] = useState<{ id: number; title: string }[]>([]);

  useEffect(() => {
    fetchAll();
  }, []);

  // useEffect(() => {
  //   const fetchDropdownData = async () => {
  //     try {
  //       const [cities, salaryTypes, courses] = await Promise.all([
  //         getByPagination(),
  //         getByPagination(),
  //         getByPagination(),
  //       ]);
  //       setCities(cities);
  //       setSalaryTypes(salaryTypes);
  //       setCourses(courses);
  //     } catch (error) {
  //       toast({ title: "خطأ", description: "فشل في جلب بيانات القوائم المنسدلة", variant: "destructive" });
  //     }
  //   };

  //   fetchDropdownData();
  // }, []);

  const fetchAll = async () => {
    try {
      const resInstructor = await getByPagination<{ data: any[] }>("Instructors/pagination", { Page: 1, Limit: 100 });
      setInstructors(resInstructor.data || []);
      const resCities = await getByPagination<{ data: any[] }>("Cityes/pagination", { Page: 1, Limit: 100 });
      setCities(resCities.data || []);
      const resSalaryTypes = await getByPagination<{ data: any[] }>("HelpTables/SalaryType", {  });
      setSalaryTypes(resSalaryTypes.data || []);
    } catch (error) {
      setInstructors([]);
      toast({ title: "خطأ", description: "فشل في جلب بيانات المحاضرين", variant: "destructive" });
    }
  };

  const filteredInstructors = instructors.filter(
    (inst) => (inst.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({ title: "خطأ", description: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }
    try {
      if (editDialog.open) {
        await edit("Instructors", editDialog.instructor.id, formData);
      } else {
        await create("Instructors", formData);
      }
      toast({ title: "تم بنجاح", description: "تم حفظ بيانات المحاضر بنجاح" });
      setIsDialogOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        nationalId: "",
        cityId: 0,
        salary: 0,
        salaryTypeId: 0,
        coursesIds: [],
      });
      fetchAll();
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في حفظ بيانات المحاضر", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteById("Instructors", id);
      toast({ title: "تم بنجاح", description: "تم حذف المحاضر بنجاح" });
      fetchAll();
    } catch (error) {
      toast({ title: "خطأ", description: "فشل في حذف المحاضر", variant: "destructive" });
    }
  };

  const handleEdit = (instructor: any) => {
    setFormData({
      name: instructor.name || "",
      email: instructor.email || "",
      phone: instructor.phone || "",
      address: instructor.address || "",
      nationalId: instructor.nationalId || "",
      cityId: instructor.cityId || 0,
      salary: instructor.salary || 0,
      salaryTypeId: instructor.salaryTypeId || 0,
      coursesIds: instructor.coursesIds || [],
    });
    setEditDialog({ open: true, instructor });
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4 md:mb-0">إدارة المحاضرين</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن محاضر..."
              className="pr-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="h-4 w-4 ml-2" />
                إضافة محاضر
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editDialog.open ? "تعديل المحاضر" : "إضافة محاضر جديد"}</DialogTitle>
                <DialogDescription>
                  {editDialog.open
                    ? "يمكنك تعديل بيانات المحاضر ثم الضغط على حفظ التعديلات."
                    : "أدخل بيانات المحاضر الجديد. اضغط حفظ عند الانتهاء."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <label htmlFor="name">الاسم</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="email">البريد الإلكتروني</label>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="phone">رقم الهاتف</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                <label htmlFor="address">العنوان</label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
                <label htmlFor="nationalId">الرقم الوطني</label>
                <Input
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                />

                {/* Dropdown for City */}
                <label htmlFor="cityId">المدينة</label>
                <Select
                  value={formData.cityId}
                  onValueChange={(value) => setFormData({ ...formData, cityId: Number(value) })}
                >
                  <SelectTrigger>اختر المدينة</SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={String(city.id)}>{city.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Dropdown for Salary Type */}
                <label htmlFor="salaryTypeId">نوع الراتب</label>
                <Select
                  value={formData.salaryTypeId}
                  onValueChange={(value) => setFormData({ ...formData, salaryTypeId: Number(value) })}
                >
                  <SelectTrigger>اختر نوع الراتب</SelectTrigger>
                  <SelectContent>
                    {salaryTypes.map((type) => (
                      <SelectItem key={type.id} value={String(type.id)}>{type.type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Dropdown for Courses */}
                <label htmlFor="coursesIds">الدورات</label>
                <Select
                  value={formData.coursesIds.length > 0 ? String(formData.coursesIds[0]) : ""}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    coursesIds: value ? [Number(value)] : [] 
                  })}
                >
                  <SelectTrigger>اختر دورة</SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={String(course.id)}>{course.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-2">
                  {formData.coursesIds.map((id) => (
                    <span key={id} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                      {courses.find((course) => course.id === id)?.title || "Unknown"}
                      <button
                        type="button"
                        className="ml-2 text-red-500"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            coursesIds: formData.coursesIds.filter((courseId) => courseId !== id),
                          })
                        }
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>

                <Button type="submit">{editDialog.open ? "حفظ التعديلات" : "حفظ"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <InstructorsTable
          instructors={filteredInstructors}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
      <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog({ open, instructor: open ? editDialog.instructor : null })}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل المحاضر</DialogTitle>
            <DialogDescription>
              يمكنك تعديل بيانات المحاضر ثم الضغط على حفظ التعديلات.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">الاسم</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">البريد الإلكتروني</label>
            <Input
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="phone">رقم الهاتف</label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <label htmlFor="address">العنوان</label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <label htmlFor="nationalId">الرقم الوطني</label>
            <Input
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
            />

            {/* Dropdown for City */}
            <label htmlFor="cityId">المدينة</label>
            <Select
              value={formData.cityId}
              onValueChange={(value) => setFormData({ ...formData, cityId: Number(value) })}
            >
              <SelectTrigger>اختر المدينة</SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={String(city.id)}>{city.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Dropdown for Salary Type */}
            <label htmlFor="salaryTypeId">نوع الراتب</label>
            <Select
              value={formData.salaryTypeId}
              onValueChange={(value) => setFormData({ ...formData, salaryTypeId: Number(value) })}
            >
              <SelectTrigger>اختر نوع الراتب</SelectTrigger>
              <SelectContent>
                {salaryTypes.map((type) => (
                  <SelectItem key={type.id} value={String(type.id)}>{type.type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Dropdown for Courses */}
            <label htmlFor="coursesIds">الدورات</label>
            <Select
              value=""
              onValueChange={(value) => {
                const courseId = Number(value);
                setFormData((prev) => ({
                  ...prev,
                  coursesIds: prev.coursesIds.includes(courseId)
                    ? prev.coursesIds.filter((id) => id !== courseId)
                    : [...prev.coursesIds, courseId],
                }));
              }}
            >
              <SelectTrigger>اختر الدورات</SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={String(course.id)}>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.coursesIds.includes(course.id)}
                        readOnly
                        className="mr-2"
                      />
                      {course.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button type="submit">حفظ التعديلات</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstructorsPage;

