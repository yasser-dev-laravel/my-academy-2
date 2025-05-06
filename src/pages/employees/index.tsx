import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import EmployeesTable from "./EmployeesTable";
import EmployeeForm from "./EmployeeForm";
import { getByPagination, create, edit, deleteById } from "@/utils/api/coreApi";
import type { EmployeeGetByIdType, EmployeeCreateType } from "@/utils/api/coreTypes";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    password: "",
    image: "",
    phone: "",
    address: "",
    nationalId: "",
    cityId: 0,
    education: "",
    salaryTypeId: 0,
    salary: 0,
    roleIds: [],
  });
  const [cities, setCities] = useState<any[]>([]);
  const [salaryTypes, setSalaryTypes] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDialog, setEditDialog] = useState({ open: false, employee: null as any });
  const { toast } = useToast();

  useEffect(() => {
    fetchAll();
    getByPagination("Roles/pagination", { Page: 1, Limit: 100 }).then((res) => setRoles(res.data ?? []));
  }, []);

  const fetchAll = async () => {
    try {
      const [usersRes, citiesRes] = await Promise.all([
        getByPagination("Users/pagination", { Page: 1, Limit: 100 }),
        getByPagination("Cityes/pagination", { Page: 1, Limit: 100 }),
      ]);
      setEmployees(usersRes.data || []);
      setCities((citiesRes.data as any[]) || []);
      setSalaryTypes([
        { id: 1, name: "Type 1" },
        { id: 2, name: "Type 2" },
        { id: 3, name: "Type 3" },
      ]);
    } catch (error) {
      setEmployees([]);
      setCities([]);
      setSalaryTypes([]);
      toast({ title: "خطأ في تحميل البيانات", description: "تعذر جلب بيانات الموظفين أو القوائم المساعدة", variant: "destructive" });
    }
  };

  const filteredEmployees = employees.filter(
    (emp) => (emp.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast({ title: "خطأ في البيانات", description: "يرجى ملء جميع الحقول المطلوبة", variant: "destructive" });
      return;
    }
    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: formData.image || "",
        phone: formData.phone || "",
        address: formData.address || "",
        nationalId: formData.nationalId || "",
        cityId: formData.cityId || 0,
        education: formData.education || "",
        salaryTypeId: formData.salaryTypeId || 0,
        salary: formData.salary || 0,
        roleIds: formData.roleIds || [],
      };
      if (editDialog.open) {
        await edit("Users", editDialog.employee.id, payload);
      } else {
        await create("Users", payload);
      }
      toast({ title: "تم بنجاح", description: "تم حفظ بيانات الموظف بنجاح" });
      setIsDialogOpen(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        image: "",
        phone: "",
        address: "",
        nationalId: "",
        cityId: 0,
        education: "",
        salaryTypeId: 0,
        salary: 0,
        roleIds: [],
      });
      fetchAll();
    } catch (error) {
      toast({ title: "خطأ في العملية", description: "تعذر حفظ بيانات الموظف", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteById("Users", id);
      toast({ title: "تم بنجاح", description: "تم حذف الموظف بنجاح" });
      fetchAll();
    } catch (error) {
      toast({ title: "خطأ في الحذف", description: "تعذر حذف الموظف", variant: "destructive" });
    }
  };

  const handleEdit = (employee: any) => {
    setFormData({
      name: employee.name || "",
      email: employee.email || "",
      password: "",
      image: employee.image || "",
      phone: employee.phone || "",
      address: employee.address || "",
      nationalId: employee.nationalId || "",
      cityId: employee.cityId || 0,
      education: employee.education || "",
      salaryTypeId: employee.salaryTypeId || 0,
      salary: employee.salary || 0,
      roleIds: employee.roleIds || [],
    });
    setEditDialog({ open: true, employee });
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
                <DialogTitle>{editDialog.open ? "تعديل الموظف" : "إضافة موظف جديد"}</DialogTitle>
                <DialogDescription>
                  {editDialog.open
                    ? "يمكنك تعديل بيانات الموظف ثم الضغط على حفظ التعديلات."
                    : "أدخل بيانات الموظف الجديد. اضغط حفظ عند الانتهاء."}
                </DialogDescription>
              </DialogHeader>
              <EmployeeForm
                values={formData}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
                onSubmit={handleSubmit}
                cities={cities}
                salaryTypes={salaryTypes}
                roles={roles}
                submitLabel={editDialog.open ? "حفظ التعديلات" : "حفظ"}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditDialog({ open: false, employee: null });
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    image: "",
                    phone: "",
                    address: "",
                    nationalId: "",
                    cityId: 0,
                    education: "",
                    salaryTypeId: 0,
                    salary: 0,
                    roleIds: [],
                  });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <EmployeesTable
          employees={filteredEmployees}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
      <Dialog open={editDialog.open} onOpenChange={open => setEditDialog({ open, employee: open ? editDialog.employee : null })}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تعديل الموظف</DialogTitle>
            <DialogDescription>
              يمكنك تعديل بيانات الموظف ثم الضغط على حفظ التعديلات.
            </DialogDescription>
          </DialogHeader>
          <EmployeeForm
            values={formData}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
            onSubmit={handleSubmit}
            cities={cities}
            salaryTypes={salaryTypes}
            roles={roles}
            submitLabel="حفظ التعديلات"
            onCancel={() => setEditDialog({ open: false, employee: null })}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesPage;
