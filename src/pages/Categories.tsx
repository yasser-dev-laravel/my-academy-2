
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
import { useToast } from "@/components/ui/use-toast";
import { getCategoriesPaginated, createCategory, deleteCategory } from "@/utils/api/categories";
import { FolderOpen, Plus, Search, Trash } from "lucide-react";

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Partial<any>>({
    name: "",
    description: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getCategoriesPaginated({ Page: 1, Limit: 100 });
        setCategories(res.data || []);
      } catch (error) {
        setCategories([]);
        toast({ title: "خطأ في تحميل التصنيفات", description: "تعذر جلب بيانات التصنيفات من الخادم", variant: "destructive" });
      }
    }
    fetchCategories();
  }, []);

  // Handle search
  const filteredCategories = categories.filter(
    (cat) =>
      (cat.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء اسم التصنيف",
        variant: "destructive",
      });
      return;
    }

    try {
      const dto = {
        name: formData.name,
        description: formData.description || "",
      };
      await createCategory(dto);
      toast({ title: "تم بنجاح", description: "تم إضافة التصنيف بنجاح" });
      setIsDialogOpen(false);
      setFormData({ name: "", description: "" });
      // Refetch categories
      const res = await getCategoriesPaginated({ Page: 1, Limit: 100 });
      setCategories(res.data || []);
    } catch (error) {
      toast({ title: "خطأ في الإضافة", description: "تعذر إضافة التصنيف", variant: "destructive" });
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      toast({ title: "تم بنجاح", description: "تم حذف التصنيف بنجاح" });
      // Refetch categories
      const res = await getCategoriesPaginated({ Page: 1, Limit: 100 });
      setCategories(res.data || []);
    } catch (error) {
      toast({ title: "خطأ في الحذف", description: "تعذر حذف التصنيف", variant: "destructive" });
    }
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
                <DialogTitle>إضافة تصنيف جديد</DialogTitle>
                <DialogDescription>
                  أدخل اسم التصنيف الجديد ووصفه.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم التصنيف *</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="مثال: التصنيف الأول"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">وصف التصنيف</Label>
                    <Input 
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="مثال: هذا هو تصنيف جديد"
                    />
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
          <CardTitle>قائمة التصنيفات</CardTitle>
          <CardDescription>
            إدارة تصنيفات الأكاديمية المختلفة
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCategories.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>اسم التصنيف</TableHead>
                    <TableHead>وصف التصنيف</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell>{cat.name}</TableCell>
                      <TableCell>{cat.description}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(cat.id)}
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
              لم يتم العثور على أقسام. قم بإضافة أقسام جديدة.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;
