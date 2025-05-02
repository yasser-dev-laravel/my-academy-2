
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
import { getRoomsPaginated, createRoom, deleteRoom } from "@/utils/api/rooms";
import { getBranchesPaginated } from "@/utils/api/branches";
import { Laptop, Monitor, Users, MapPin, Plus, Search, Trash } from "lucide-react";

const Labs = () => {
  const [labs, setLabs] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Partial<any>>({
    name: "",
    branchId: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load rooms and branches from API
  useEffect(() => {
    async function fetchData() {
      try {
        const [roomsRes, branchesRes] = await Promise.all([
          getRoomsPaginated({ Page: 1, Limit: 100 }),
          getBranchesPaginated({ Page: 1, Limit: 100 }),
        ]);
        setLabs(roomsRes.data || []);
        setBranches(branchesRes.data || []);
      } catch (error) {
        setLabs([]);
        setBranches([]);
        toast({ title: "خطأ في تحميل البيانات", description: "تعذر جلب بيانات القاعات أو الفروع من الخادم", variant: "destructive" });
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

    if (!formData.name || !formData.branchId) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      const dto = {
        name: formData.name!,
        branchId: Number(formData.branchId),
      };
      await createRoom(dto);
      toast({ title: "تم بنجاح", description: "تم إضافة القاعة بنجاح" });
      setIsDialogOpen(false);
      setFormData({ name: "", branchId: "" });
      // Refetch rooms
      const roomsRes = await getRoomsPaginated({ Page: 1, Limit: 100 });
      setLabs(roomsRes.data || []);
    } catch (error) {
      toast({ title: "خطأ في الإضافة", description: "تعذر إضافة القاعة", variant: "destructive" });
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
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم القاعة/المعمل *</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="مثال: معمل الكمبيوتر 1"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="branchId">الفرع *</Label>
                    <Select 
                      name="branchId"
                      value={formData.branchId}
                      onValueChange={(value) => handleSelectChange("branchId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الفرع" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>الفرع</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLabs.map((lab) => (
  <TableRow key={lab.id}>
    <TableCell className="font-medium">{lab.name}</TableCell>
    <TableCell>{getBranchName(lab.branchId)}</TableCell>
    <TableCell className="text-right">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleDelete(lab.id)}
      >
        <Trash className="h-4 w-4 text-destructive" />
      </Button>
    </TableCell>
  </TableRow>
))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              لم يتم العثور على قاعات أو معامل. قم بإضافة قاعات ومعامل جديدة.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Labs;
