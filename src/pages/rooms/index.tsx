import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getRoomsPaginated, createRoom, deleteRoom, updateRoom } from "@/utils/api/rooms";
import { getBranchesPaginated } from "@/utils/api/branches";
import { getHelpTableRoomType } from "@/utils/api/helpTables";
import { Laptop, Monitor, Users, MapPin, Plus, Search, Trash } from "lucide-react";
import RoomForm from "./RoomForm";
import RoomsTable from "./RoomsTable";

const Labs = () => {
  const [labs, setLabs] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [roomTypes, setRoomTypes] = useState<{ value: string; label: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<{ name: string; branchId: string ; type: string; capacity: number | string; }>({ name: "", branchId: "" ,type: "", capacity: ""});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load rooms and branches from API
  useEffect(() => {
    async function fetchData() {
      try {
        const [roomsRes, branchesRes, roomTypesRes] = await Promise.all([
          getRoomsPaginated({ Page: 1, Limit: 100 }),
          getBranchesPaginated({ Page: 1, Limit: 100 }),
          (getHelpTableRoomType() as unknown as Promise<{ data: { id: number; name: string }[] }>),
        ]);
        setLabs(roomsRes.data || []);
        setBranches(branchesRes.data || []);
        setRoomTypes(
          ((roomTypesRes as { data: { id: number; name: string }[] }).data || []).map((type) => ({
            value: type.id.toString(),
            label: type.name,
          }))
        );
      } catch (error) {
        setLabs([]);
        setBranches([]);
        setRoomTypes([]);
        toast({ title: "خطأ في تحميل البيانات", description: "تعذر جلب بيانات القاعات أو الفروع أو أنواع القاعات من الخادم", variant: "destructive" });
      }
    }
    fetchData();
  }, []);

  // Handle search
  const filteredLabs = labs.filter(
    (lab) => 
      lab.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lab.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Convert number inputs
    if (type === "number") {
      setFormData({ ...formData, [name]: parseInt(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.branchId || !formData.type || !formData.capacity) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editDialog.open && editDialog.room) {
        // تعديل
        const dto = {
          id: editDialog.room.id,
          name: formData.name!,
          branchId: Number(formData.branchId),
          type: formData.type,
          capacity: Number(formData.capacity),
        };
        await updateRoom(editDialog.room.id, dto);
        toast({ title: "تم بنجاح", description: "تم تعديل القاعة بنجاح" });
        setEditDialog({ open: false, room: null });
      } else {
        // إضافة
        const dto = {
          name: formData.name!,
          branchId: Number(formData.branchId),
          type: formData.type,
          capacity: Number(formData.capacity),
        };
        await createRoom(dto);
        toast({ title: "تم بنجاح", description: "تم إضافة القاعة بنجاح" });
        setIsDialogOpen(false);
        setFormData({ name: "", branchId: "", type: "", capacity: "" });
      }
      // Refetch rooms
      const roomsRes = await getRoomsPaginated({ Page: 1, Limit: 100 });
      setLabs(roomsRes.data || []);
    } catch (error) {
      toast({ title: "خطأ في العملية", description: "تعذر حفظ بيانات القاعة", variant: "destructive" });
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      await deleteRoom(id);
      toast({ title: "تم بنجاح", description: "تم حذف القاعة بنجاح" });
      // Refetch rooms
      const roomsRes = await getRoomsPaginated({ Page: 1, Limit: 100 });
      setLabs(roomsRes.data || []);
    } catch (error) {
      toast({ title: "خطأ في الحذف", description: "تعذر حذف القاعة", variant: "destructive" });
    }
  };

  // Get branch name by ID
  const getBranchName = (branchId: string) => {
    const branch = branches.find((b) => b.id === branchId);
    return branch?.name || "غير معروف";
  };

  // Get lab type icon and text
  const getanyTypeInfo = (type: string) => {
    switch (type) {
      case "computer":
        return {
          icon: <Monitor className="h-4 w-4 text-blue-500" />,
          text: "معمل كمبيوتر",
        };
      case "language":
        return {
          icon: <Laptop className="h-4 w-4 text-green-500" />,
          text: "معمل لغات",
        };
      case "general":
        return {
          icon: <Users className="h-4 w-4 text-orange-500" />,
          text: "قاعة عامة",
        };
      default:
        return {
          icon: <Laptop className="h-4 w-4" />,
          text: "معمل",
        };
    }
  };

  // تجهيز بيانات الجدول مع جميع خصائص القاعة
  const roomsTableData = filteredLabs.map((lab: any) => ({
    id: lab.id,
    name: lab.name,
    type: lab.type,
    capacity: lab.capacity,
    branchName: getBranchName(lab.branchId),
    // يمكنك إضافة خصائص أخرى إذا وجدت
  }));

  // دالة فتح نافذة التعديل
  const [editDialog, setEditDialog] = useState({ open: false, room: null as any });
  const handleEdit = (room: any) => {
    // تأكد من أن النوع مطابق لقيم roomTypes
    let typeValue = room.type;
    // ابحث عن النوع المناسب في roomTypes حسب الاسم أو القيمة
    const foundType = roomTypes.find(rt => rt.value === room.type || rt.label === room.type);
    if (foundType) {
      typeValue = foundType.value;
    } else if (roomTypes.length > 0) {
      typeValue = roomTypes[0].value;
    } else {
      typeValue = "";
    }
    setFormData({
      name: room.name || "",
      branchId: room.branchId ? String(room.branchId) : "",
      type: typeValue,
      capacity: room.capacity || ""
    });
    setEditDialog({ open: true, room: { ...room, type: typeValue } });
  };

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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="h-4 w-4 ml-2" />
                إضافة قاعة/معمل
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>إضافة قاعة/معمل جديد</DialogTitle>
                <DialogDescription>
                  أدخل بيانات القاعة أو المعمل الجديد. سيتم إنشاء كود فريد تلقائياً.
                </DialogDescription>
              </DialogHeader>
              <RoomForm
                values={formData}
                branches={branches}
                roomTypes={roomTypes}
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
          <CardTitle>قائمة القاعات والمعامل</CardTitle>
          <CardDescription>
            إدارة القاعات والمعامل في الفروع المختلفة
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLabs.length > 0 ? (
            <div className="rounded-md border">
              <RoomsTable
                rooms={roomsTableData}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              لم يتم العثور على قاعات أو معامل. قم بإضافة قاعات ومعامل جديدة.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog تعديل القاعة */}
      <Dialog open={editDialog.open} onOpenChange={open => setEditDialog({ open, room: open ? editDialog.room : null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل بيانات القاعة</DialogTitle>
            <DialogDescription>
              يمكنك تعديل بيانات القاعة ثم الضغط على حفظ التعديلات.
            </DialogDescription>
          </DialogHeader>
          <RoomForm
            values={editDialog.room || { name: '', branchId: '', type: '', capacity: '' }}
            branches={branches}
            roomTypes={roomTypes}
            onChange={handleSelectChange}
            onSubmit={handleSubmit}
            submitLabel="حفظ التعديلات"
            onCancel={() => setEditDialog({ open: false, room: null })}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Labs;
