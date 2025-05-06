import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getByPagination, create, edit, deleteById } from "@/utils/api/coreApi";
import type { RoomGetByIdType, RoomTypesType, BrancheGetByIdType } from "@/utils/api/coreTypes";
import RoomForm from "./RoomForm";
import RoomsTable from "./RoomsTable";

// نوع بيانات النموذج
interface RoomFormData {
  name: string;
  branchId: string;
  type: string;
  capacity: string | number;
}

const Rooms = () => {
  const [rooms, setRooms] = useState<RoomGetByIdType[]>([]);
  const [branches, setBranches] = useState<BrancheGetByIdType[]>([]);
  const [roomTypes, setRoomTypes] = useState<{ value: string; label: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<RoomFormData>({ name: "", branchId: "", type: "", capacity: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDialog, setEditDialog] = useState<{ open: boolean; room: RoomGetByIdType | null }>({ open: false, room: null });
  const { toast } = useToast();

  // جلب البيانات
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const roomsRes = await getByPagination("Rooms/pagination", { Page: 1, Limit: 100 });
      setRooms((roomsRes as { data: RoomGetByIdType[] }).data || []);
      const branchesRes = await getByPagination("Branches/pagination", { Page: 1, Limit: 100 });
      setBranches((branchesRes as { data: BrancheGetByIdType[] }).data || []);
      const roomTypesRes = await getByPagination("HelpTables/RoomType", {});
      const types = ((roomTypesRes as { data: RoomTypesType[] }).data || []).map(rt => ({ value: String(rt.id), label: rt.name }));
      setRoomTypes(types);
    } catch {
      setRooms([]); setBranches([]); setRoomTypes([]);
      toast({ title: "خطأ في تحميل البيانات", description: "تعذر جلب البيانات من الخادم", variant: "destructive" });
    }
  };

  // دوال مساعدة
  const getBranchName = (branchId: number) => branches.find(b => b.id === branchId)?.name || "غير معروف";
  const roomsTableData = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) || String(room.id).includes(searchTerm)
  ).map(room => ({ ...room, branchName: getBranchName(room.branchId) }));

  // تغيير الحقول
  const handleFieldChange = (name: string, value: string) => setFormData(prev => ({ ...prev, [name]: value }));

  // إضافة أو تعديل
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.branchId || !formData.type || !formData.capacity) {
      toast({ title: "خطأ في البيانات", description: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }
    try {
      if (editDialog.open && editDialog.room) {
        await edit("Rooms", editDialog.room.id, {
          id: editDialog.room.id,
          name: formData.name,
          branchId: Number(formData.branchId),
          type: Number(formData.type),
          capacity: Number(formData.capacity),
        });
        toast({ title: "تم التعديل بنجاح" });
        setEditDialog({ open: false, room: null });
      } else {
        await create("Rooms", {
          name: formData.name,
          branchId: Number(formData.branchId),
          type: Number(formData.type),
          capacity: Number(formData.capacity),
        });
        toast({ title: "تمت الإضافة بنجاح" });
        setIsDialogOpen(false);
      }
      setFormData({ name: "", branchId: "", type: "", capacity: "" });
      fetchAllData();
    } catch {
      toast({ title: "خطأ في العملية", description: "تعذر حفظ البيانات", variant: "destructive" });
    }
  };

  // حذف
  const handleDelete = async (id: number) => {
    try {
      await deleteById("Rooms", id);
      toast({ title: "تم الحذف بنجاح" });
      fetchAllData();
    } catch {
      toast({ title: "خطأ في الحذف", variant: "destructive" });
    }
  };

  // فتح نافذة التعديل
  const handleEdit = (room: RoomGetByIdType) => {
    setFormData({
      name: room.name || "",
      branchId: room.branchId ? String(room.branchId) : "",
      type: room.type !== null && room.type !== undefined ? String(room.type) : "",
      capacity: room.capacity || ""
    });
    setEditDialog({ open: true, room });
  };

  // ...واجهة المستخدم...
  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4 md:mb-0">إدارة القاعات والمعامل</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن قاعة أو معمل..."
              className="pr-8"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="h-4 w-4 ml-2" />إضافة قاعة/معمل
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>إضافة قاعة/معمل جديد</DialogTitle>
                <DialogDescription>أدخل بيانات القاعة أو المعمل الجديد.</DialogDescription>
              </DialogHeader>
              <RoomForm
                values={formData}
                branches={branches.map(b => ({ id: b.id, name: b.name }))}
                roomTypes={roomTypes.map(rt => ({ id: Number(rt.id), name: rt.name }))}
                onChange={handleFieldChange}
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
          <CardTitle>قائمة القاعات والمعامل</CardTitle>
          <CardDescription>إدارة القاعات والمعامل في الفروع المختلفة</CardDescription>
        </CardHeader>
        <CardContent>
          {roomsTableData.length > 0 ? (
            <div className="rounded-md border">
              <RoomsTable rooms={roomsTableData} onDelete={handleDelete} onEdit={handleEdit} />
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">لم يتم العثور على قاعات أو معامل. قم بإضافة قاعات ومعامل جديدة.</div>
          )}
        </CardContent>
      </Card>
      {/* Dialog تعديل القاعة */}
      <Dialog open={editDialog.open} onOpenChange={open => setEditDialog({ open, room: open ? editDialog.room : null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل بيانات القاعة</DialogTitle>
            <DialogDescription>يمكنك تعديل بيانات القاعة ثم الضغط على حفظ التعديلات.</DialogDescription>
          </DialogHeader>
          <RoomForm
            values={formData}
            branches={branches.map(b => ({ id: b.id, name: b.name }))}
            roomTypes={roomTypes.map(rt => ({ id: Number(rt.value), name: rt.label }))}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
            submitLabel="حفظ التعديلات"
            onCancel={() => setEditDialog({ open: false, room: null })}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rooms;
