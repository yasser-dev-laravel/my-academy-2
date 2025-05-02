
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
import { getBranchesPaginated, createBranch, deleteBranch } from "@/utils/api/branches";
// استيراد المحافظات من ملف ثابت أو API إذا توفر
import { getCitiesPaginated } from "@/utils/api/cities";
import { Building, MapPin, Plus, Search, Trash } from "lucide-react";

const Branches = () => {
  const [branches, setBranches] = useState<any>([]);
  const [cities, setCities] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<any>({
    name: "",
    governorate: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // جلب الفروع من API عند تحميل الصفحة
  useEffect(() => {
    async function fetchBranches() {
      try {
        const res = await getBranchesPaginated({ Page: 1, Limit: 100 });
        setBranches(Array.isArray(res.data) ? res.data.map(b => ({
          id: String(b.id),
          name: b.name || '',
          address: b.address || '',
          areaId: String(b.areaId),
          areaName: b.areaName || '',
          code: String(b.id),
          governorate: b.areaName || ''
        })) : []);
      } catch (error) {
        setBranches([]);
      }
    }
    // Fetch cities from API and update state
    async function fetchCities() {
      try {
        const res = await getCitiesPaginated({ Page: 1, Limit: 100 });
        setCities(Array.isArray(res.data) ? res.data.map(c => c.name || "") : []);
      } catch (error) {
        setCities([]);
      }
    }
    fetchCities();
    fetchBranches();
  }, []);

  // Handle search
  const filteredBranches = branches.filter(
    (branch) => 
      branch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.governorate) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    try {
      // استخدم createBranch من الـ API
      await createBranch({
        name: formData.name,
        areaId: 1, // عدل هذا حسب الحاجة إذا كان لديك قائمة محافظات مع معرفات
        address: null,
      });
      // أعد جلب الفروع من الـ API
      const res = await getBranchesPaginated({ Page: 1, Limit: 100 });
      setBranches(Array.isArray(res.data) ? res.data.map(b => ({
        id: String(b.id),
        code: String(b.id) || '', // Ensure code is always a string (use id as fallback)
        name: b.name || '',
        governorate: b.areaName || '',
      })) : []);
      setFormData({ name: "", governorate: "" });
      setIsDialogOpen(false);
      toast({ title: "تم بنجاح", description: "تم إضافة الفرع بنجاح" });
    } catch (error) {
      toast({ title: "خطأ في إضافة الفرع", variant: "destructive" });
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      await deleteBranch(Number(id));
      // أعد جلب الفروع من الـ API
      const res = await getBranchesPaginated({ Page: 1, Limit: 100 });
      setBranches(Array.isArray(res.data) ? res.data.map(b => ({
        id: String(b.id),
        code: String(b.id) || '', // Ensure code is always a string (use id as fallback)
        name: b.name || '',
        governorate: b.areaName || '',
      })) : []);
      toast({ title: "تم بنجاح", description: "تم حذف الفرع بنجاح" });
    } catch (error) {
      toast({ title: "خطأ في حذف الفرع", variant: "destructive" });
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
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم الفرع *</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="مثال: الفرع الرئيسي - المعادي"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="governorate">المحافظة *</Label>
                    <Select 
                      name="governorate"
                      value={formData.governorate}
                      onValueChange={(value) => handleSelectChange("governorate", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المحافظة" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city: string) => (
                          <SelectItem key={city} value={city}>
                            {city}
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
          <CardTitle>قائمة الفروع</CardTitle>
          <CardDescription>
            إدارة فروع الأكاديمية في المحافظات المختلفة
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBranches.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم الفرع</TableHead>
                    <TableHead>المحافظة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBranches.map((branch) => (
                    <TableRow key={branch.id}>
 
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-primary" />
                          <span>{branch.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{branch.governorate}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(branch.id)}
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
              لم يتم العثور على فروع. قم بإضافة فروع جديدة.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Branches;
