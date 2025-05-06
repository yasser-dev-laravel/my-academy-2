import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { getByPagination, edit, deleteById } from "@/utils/api/coreApi";

import { Plus, Search } from "lucide-react";
import BranchForm from "./BranchForm";
import BranchesTable from "./BranchesTable";
import type { BrancheGetByIdType, BrancheEditType, AreaGetByIdType,BrancheCreateType } from "@/utils/api/coreTypes";

const Branches = () => {
const [branches, setBranches] = useState<BrancheGetByIdType[]>([]);
  const [areas, setAreas] = useState<AreaGetByIdType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<BrancheEditType>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [editDialog, setEditDialog] = useState({ open: false, branch: null });
  const [editForm, setEditForm] = useState<BrancheEditType>({ id: 0, name: "", address: "", areaId: 0 });

  // دالة موحدة لجلب الفروع
  const fetchBranchesAndAreas = async () => {
    try {
      // جلب المناطق أولاً
      const areasRes = await getByPagination<{ data: AreaGetByIdType[] }>("Areaes/pagination", { Page: 1, Limit: 100 });
      const allAreas = Array.isArray(areasRes.data) ? areasRes.data : [];
      setAreas(allAreas);
      // جلب الفروع
      const branchesRes = await getByPagination<{ data: BrancheGetByIdType[] }>("Branches/pagination", { Page: 1, Limit: 100 });
      const branchesData = Array.isArray(branchesRes.data) ? branchesRes.data : [];
      setBranches(branchesData);
    } catch (error) {
      setBranches([]);
      setAreas([]);
    }
  };

  useEffect(() => {
    fetchBranchesAndAreas();
  }, []);

  // Handle search
  const filteredBranches = branches.filter(
    (branch) => 
      branch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form changes
  const handleChange = (field: keyof BrancheCreateType, value: string) => {
    setFormData({ ...formData, [field]: field === 'areaId' ? Number(value) : value });
  };

  // Handle select changes
  const handleSelectChange = (field: keyof BrancheCreateType, value: string) => {
    setFormData({ ...formData, [field]: field === 'areaId' ? Number(value) : value });
  };
  const handleEditSelectChange = (field: keyof BrancheEditType, value: string) => {
    setEditForm({ ...editForm, [field]: field === 'areaId' ? Number(value) : value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.areaId) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    try {
      // استدعاء دالة إضافة فرع جديد (يفضل أن يكون هناك create في coreApi)
      await edit<BrancheEditType>("Branches", 0, formData);
      await fetchBranchesAndAreas();
      setFormData({ id:0,name: "", address: "", areaId: 0 });
      setIsDialogOpen(false);
      toast({ title: "تم بنجاح", description: "تم إضافة الفرع بنجاح" });
    } catch (error) {
      toast({ title: "خطأ في إضافة الفرع", variant: "destructive" });
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      await deleteById("Branches", id);
      await fetchBranchesAndAreas();
      toast({ title: "تم بنجاح", description: "تم حذف الفرع بنجاح" });
    } catch (error) {
      toast({ title: "خطأ في حذف الفرع", variant: "destructive" });
    }
  };

  // فتح نافذة التعديل مع بيانات الفرع
  const handleEdit = (branch: BrancheGetByIdType) => {
    setEditForm({ id: branch.id, name: branch.name, address: branch.address ?? '', areaId: branch.areaId });
    setEditDialog({ open: true, branch });
  };

  // حفظ التعديلات
  const handleEditSave = async () => {
    if (!editForm.name || !editForm.areaId) {
      toast({ title: "خطأ في البيانات", description: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }
    try {
      await edit<BrancheEditType>("Branches", editForm.id, editForm);
      await fetchBranchesAndAreas();
      setEditDialog({ open: false, branch: null });
      toast({ title: "تم تعديل الفرع بنجاح" });
    } catch (error) {
      toast({ title: "خطأ في تعديل الفرع", variant: "destructive" });
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4 md:mb-0">إدارة الفروع</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن فرع..."
              className="pr-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="h-4 w-4 ml-2" />
                إضافة فرع
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>إضافة فرع جديد</DialogTitle>
                <DialogDescription>
                  أدخل بيانات الفرع الجديد. سيتم إنشاء كود فريد تلقائياً.
                </DialogDescription>
              </DialogHeader>
              <BranchForm
                values={formData}
                areas={areas}
                onChange={handleSelectChange}
                onSubmit={handleSubmit}
                submitLabel="حفظ"
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة الفروع</CardTitle>
          <CardDescription>
            إدارة فروع الأكاديمية في المحافظات المختلفة
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBranches.length > 0 ? (
            <div className="rounded-md border">
              <BranchesTable
                branches={filteredBranches}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              لم يتم العثور على فروع. قم بإضافة فروع جديدة.
            </div>
          )}
          {/* Dialog تعديل الفرع */}
          <Dialog open={editDialog.open} onOpenChange={open => setEditDialog({ open, branch: open ? editDialog.branch : null })}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>تعديل بيانات الفرع</DialogTitle>
                <DialogDescription>
                  يمكنك تعديل بيانات الفرع ثم الضغط على حفظ التعديلات.
                </DialogDescription>
              </DialogHeader>
              <BranchForm
                values={editForm}
                areas={areas}
                onChange={handleEditSelectChange}
                onSubmit={e => { e.preventDefault(); handleEditSave(); }}
                submitLabel="حفظ التعديلات"
                onCancel={() => setEditDialog({ open: false, branch: null })}
              />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default Branches;
