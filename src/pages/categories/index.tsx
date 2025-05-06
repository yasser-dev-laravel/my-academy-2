import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import CategoriesTable from "./CategoriesTable";
import CategoryForm from "./CategoryForm";
import { getByPagination, create, edit, deleteById } from "@/utils/api/coreApi";
import type { CategoryGetByIdType, CategoryCreateType } from "@/utils/api/coreTypes";

const Departments = () => {
  const [categories, setCategories] = useState<CategoryGetByIdType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDialog, setEditDialog] = useState({ open: false, category: null as any });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getByPagination<{ data: CategoryGetByIdType[] }>("Categories/pagination", { Page: 1, Limit: 100 });
      setCategories(res.data || []);
    } catch (error) {
      setCategories([]);
      toast({ title: "خطأ في تحميل التصنيفات", description: "تعذر جلب بيانات التصنيفات من الخادم", variant: "destructive" });
    }
  };

  const filteredCategories = categories.filter(
    (cat) =>
      (cat.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast({ title: "خطأ في البيانات", description: "يرجى ملء اسم التصنيف", variant: "destructive" });
      return;
    }
    try {
      if (editDialog.open && editDialog.category) {
        await edit("Categories", editDialog.category.id, { id: editDialog.category.id, name: formData.name, description: formData.description });
        // await edit("Categories", editDialog.category.id, { name: formData.name, description: formData.description });
        toast({ title: "تم بنجاح", description: "تم تعديل التصنيف بنجاح" });
        setEditDialog({ open: false, category: null });
      } else {
        await create("Categories", { name: formData.name, description: formData.description });
        toast({ title: "تم بنجاح", description: "تم إضافة التصنيف بنجاح" });
        setIsDialogOpen(false);
      }
      setFormData({ name: "", description: "" });
      fetchCategories();
    } catch (error) {
      toast({ title: "خطأ في العملية", description: "تعذر حفظ بيانات التصنيف", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteById("Categories", id);
      toast({ title: "تم بنجاح", description: "تم حذف التصنيف بنجاح" });
      fetchCategories();
    } catch (error) {
      toast({ title: "خطأ في الحذف", description: "تعذر حذف التصنيف", variant: "destructive" });
    }
  };

  const handleEdit = (category: any) => {
    setFormData({ name: category.name || "", description: category.description || "" });
    setEditDialog({ open: true, category });
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4 md:mb-0">إدارة التصنيفات</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن تصنيف..."
              className="pr-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="h-4 w-4 ml-2" />
                إضافة تصنيف
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editDialog.open ? "تعديل التصنيف" : "إضافة تصنيف جديد"}</DialogTitle>
                <DialogDescription>
                  {editDialog.open
                    ? "يمكنك تعديل بيانات التصنيف ثم الضغط على حفظ التعديلات."
                    : "أدخل اسم التصنيف الجديد ووصفه."}
                </DialogDescription>
              </DialogHeader>
              <CategoryForm
                values={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                submitLabel={editDialog.open ? "حفظ التعديلات" : "حفظ"}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditDialog({ open: false, category: null });
                  setFormData({ name: "", description: "" });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <CategoriesTable
          categories={filteredCategories}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
      <Dialog open={editDialog.open} onOpenChange={open => setEditDialog({ open, category: open ? editDialog.category : null })}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editDialog.open ? "تعديل التصنيف" : "إضافة تصنيف جديد"}</DialogTitle>
            <DialogDescription>
              {editDialog.open
                ? "يمكنك تعديل بيانات التصنيف ثم الضغط على حفظ التعديلات."
                : "أدخل اسم التصنيف الجديد ووصفه."}
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            values={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitLabel={editDialog.open ? "حفظ التعديلات" : "حفظ"}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditDialog({ open: false, category: null });
              setFormData({ name: "", description: "" });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Departments;
