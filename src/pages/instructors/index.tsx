import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import InstructorsTable from "./InstructorsTable";
import InstructorForm from "./InstructorForm";
import { getInstructorsPaginated, createInstructor, updateInstructor, deleteInstructor } from "@/utils/api/instructors";

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

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const res = await getInstructorsPaginated({ Page: 1, Limit: 100 });
      setInstructors(res.data || []);
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
        await updateInstructor(editDialog.instructor.id, formData);
      } else {
        await createInstructor(formData);
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
      await deleteInstructor(id);
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
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editDialog.open ? "تعديل المحاضر" : "إضافة محاضر جديد"}</DialogTitle>
                <DialogDescription>
                  {editDialog.open
                    ? "يمكنك تعديل بيانات المحاضر ثم الضغط على حفظ التعديلات."
                    : "أدخل بيانات المحاضر الجديد. اضغط حفظ عند الانتهاء."}
                </DialogDescription>
              </DialogHeader>
              <InstructorForm
                values={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                submitLabel={editDialog.open ? "حفظ التعديلات" : "حفظ"}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditDialog({ open: false, instructor: null });
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
                }}
              />
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تعديل المحاضر</DialogTitle>
            <DialogDescription>
              يمكنك تعديل بيانات المحاضر ثم الضغط على حفظ التعديلات.
            </DialogDescription>
          </DialogHeader>
          <InstructorForm
            values={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitLabel="حفظ التعديلات"
            onCancel={() => setEditDialog({ open: false, instructor: null })}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstructorsPage;

