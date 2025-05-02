
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
import { getEmployeesPaginated, createEmployee, deleteEmployee } from "@/utils/api/employees";
import { getRolesPaginated } from "@/utils/api/roles";
// import { Employee } from "@/utils/mockData";
import { BadgeCheck, Plus, Search, Trash } from "lucide-react";

const Employees = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Partial<any>>({
    name: "",
    birthDate: "",
    nationalId: "",
    qualification: "",
    status: "active",
    salary: 0,
    paymentMethod: "monthly",
    paymentAmount: 0,
    roleId: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load employees and roles from API
  useEffect(() => {
    async function fetchData() {
      try {
        const [empRes, rolesRes] = await Promise.all([
          getEmployeesPaginated({ Page: 1, Limit: 100 }),
          getRolesPaginated({ Page: 1, Limit: 100 }),
        ]);
        setEmployees(empRes.data || []);
        setRoles(rolesRes.data || []);
      } catch (error) {
        setEmployees([]);
        setRoles([]);
        toast({ title: "خطأ في تحميل البيانات", description: "تعذر جلب بيانات الموظفين أو الأدوار من الخادم", variant: "destructive" });
      }
    }
    fetchData();
  }, []);

  // Handle search
  const filteredEmployees = employees.filter(
    (employee) => employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Convert number inputs
    if (type === "number") {
      setFormData({ ...formData, [name]: parseFloat(value) });
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

    if (!formData.name || !formData.nationalId || !formData.roleId) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    try {
      // Prepare API DTO
      const dto = {
        name: formData.name!,
        email: "", // يمكنك إضافة بريد إلكتروني إذا كان متاحًا في النموذج
        password: null,
        phone: null,
        address: null,
        nationalId: formData.nationalId!,
        cityId: null,
        department: null,
        salary: formData.salary || 0,
        salaryTypeId: null,
        jobTitle: null,
      };
      await createEmployee(dto);
      toast({ title: "تم بنجاح", description: "تم إضافة الموظف بنجاح" });
      setIsDialogOpen(false);
      setFormData({
        name: "",
        birthDate: "",
        nationalId: "",
        qualification: "",
        status: "active",
        salary: 0,
        paymentMethod: "monthly",
        paymentAmount: 0,
        roleId: "",
      });
      // Refetch employees
      const empRes = await getEmployeesPaginated({ Page: 1, Limit: 100 });
      setEmployees(empRes.data || []);
    } catch (error) {
      toast({ title: "خطأ في الإضافة", description: "تعذر إضافة الموظف", variant: "destructive" });
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    try {
      await deleteEmployee(id);
      toast({ title: "تم بنجاح", description: "تم حذف الموظف بنجاح" });
      // Refetch employees
      const empRes = await getEmployeesPaginated({ Page: 1, Limit: 100 });
      setEmployees(empRes.data || []);
    } catch (error) {
      toast({ title: "خطأ في الحذف", description: "تعذر حذف الموظف", variant: "destructive" });
    }
  };

  // Get role name by ID
  const getRoleName = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    return role?.name || "غير معروف";
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-3xl font-bold tracking-tight mb-4 md:mb-0">إدارة الموظفين</h2>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن موظف..."
              className="pr-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="h-4 w-4 ml-2" />
                إضافة موظف
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>إضافة موظف جديد</DialogTitle>
                <DialogDescription>
                  أدخل بيانات الموظف الجديد. اضغط حفظ عند الانتهاء.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">اسم الموظف *</Label>
                      <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nationalId">الرقم القومي *</Label>
                      <Input 
                        id="nationalId"
                        name="nationalId"
                        value={formData.nationalId}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">تاريخ الميلاد</Label>
                      <Input 
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qualification">المؤهل</Label>
                      <Input 
                        id="qualification"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">الحالة</Label>
                      <Select 
                        name="status"
                        value={formData.status}
                        onValueChange={(value) => handleSelectChange("status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر حالة الموظف" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">يعمل</SelectItem>
                          <SelectItem value="suspended">موقوف</SelectItem>
                          <SelectItem value="training">تدريب</SelectItem>
                          <SelectItem value="terminated">منتهي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roleId">الدور *</Label>
                      <Select 
                        name="roleId"
                        value={formData.roleId}
                        onValueChange={(value) => handleSelectChange("roleId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر دور الموظف" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">طريقة الحساب</Label>
                      <Select 
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر طريقة الحساب" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">شهري</SelectItem>
                          <SelectItem value="commission">عمولة</SelectItem>
                          <SelectItem value="percentage">نسبة</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary">المرتب</Label>
                      <Input 
                        id="salary"
                        name="salary"
                        type="number"
                        value={formData.salary?.toString()}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentAmount">قيمة الحساب</Label>
                      <Input 
                        id="paymentAmount"
                        name="paymentAmount"
                        type="number"
                        value={formData.paymentAmount?.toString()}
                        onChange={handleChange}
                      />
                    </div>
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
          <CardTitle>قائمة الموظفين</CardTitle>
          <CardDescription>
            إدارة بيانات الموظفين وأدوارهم في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>الرقم القومي</TableHead>
                    <TableHead>المؤهل</TableHead>
                    <TableHead>الدور</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.nationalId}</TableCell>
                      <TableCell>{employee.qualification}</TableCell>
                      <TableCell>{getRoleName(employee.roleId)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <BadgeCheck className="h-4 w-4 text-green-500" />
                          <span>
                            {employee.status === "active" ? "يعمل" : 
                             employee.status === "suspended" ? "موقوف" : 
                             employee.status === "training" ? "تدريب" : "منتهي"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(employee.id)}
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
              لم يتم العثور على موظفين. قم بإضافة موظفين جدد.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Employees;
