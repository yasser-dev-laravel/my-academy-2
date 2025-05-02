import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface EmployeeFormProps {
  values: {
    id?: number;
    email: string;
    name: string;
    password?: string | null;
    phone?: string | null;
    address?: string | null;
    nationalId?: string | null;
    cityId?: number | string | null;
    department?: string | null;
    salary: number | string;
    salaryTypeId?: number | string | null;
    jobTitle?: string | null;
    roleIds?: number[];
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string | number[] | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  cities: { id: number; name: string }[];
  salaryTypes: { id: number; name: string }[];
  roles: { id: number; name: string }[];
  submitLabel?: string;
  onCancel?: () => void;
}

const EmployeeForm = ({ values, onChange, onSelectChange, onSubmit, cities, salaryTypes, roles, submitLabel = "حفظ", onCancel }: EmployeeFormProps) => (
  <form onSubmit={onSubmit} style={{ maxHeight: 500, overflowY: 'auto' }}>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">اسم الموظف *</Label>
          <Input id="name" name="name" value={values.name} onChange={onChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" name="email" value={values.email} onChange={onChange} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input id="password" name="password" value={values.password || ""} onChange={onChange} type="password" autoComplete="new-password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input id="phone" name="phone" value={values.phone || ""} onChange={onChange} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="address">العنوان</Label>
          <Input id="address" name="address" value={values.address || ""} onChange={onChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nationalId">الرقم القومي *</Label>
          <Input id="nationalId" name="nationalId" value={values.nationalId || ""} onChange={onChange} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cityId">المدينة</Label>
          <Select name="cityId" value={values.cityId?.toString() || ""} onValueChange={v => onSelectChange("cityId", v)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر المدينة" />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city.id} value={city.id.toString()}>{city.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">القسم/الإدارة</Label>
          <Input id="department" name="department" value={values.department || ""} onChange={onChange} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="salary">المرتب</Label>
          <Input id="salary" name="salary" type="number" value={values.salary} onChange={onChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salaryTypeId">نوع الراتب</Label>
          <Select name="salaryTypeId" value={values.salaryTypeId?.toString() || ""} onValueChange={v => onSelectChange("salaryTypeId", v)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر نوع الراتب" />
            </SelectTrigger>
            <SelectContent>
              {salaryTypes.map(type => (
                <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="jobTitle">المسمى الوظيفي</Label>
        <Input id="jobTitle" name="jobTitle" value={values.jobTitle || ""} onChange={onChange} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="roleIds">الأدوار</Label>
        <div className="flex flex-col gap-2">
          {roles.map((role) => (
            <label key={role.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={values.roleIds?.includes(role.id)}
                onCheckedChange={(checked) => {
                  let newRoleIds = Array.isArray(values.roleIds) ? [...values.roleIds] : [];
                  if (checked) {
                    if (!newRoleIds.includes(role.id)) newRoleIds.push(role.id);
                  } else {
                    newRoleIds = newRoleIds.filter((id) => id !== role.id);
                  }
                  onSelectChange("roleIds", newRoleIds);
                }}
                id={`role-${role.id}`}
              />
              <span>{role.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
    <DialogFooter>
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
      )}
      <Button type="submit">{submitLabel}</Button>
    </DialogFooter>
  </form>
);

export default EmployeeForm;
