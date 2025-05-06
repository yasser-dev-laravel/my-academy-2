import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface GroupFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (group: any) => void;
  group?: any;
  courses: any[];
  levels: any[];
  branches: any[];
  rooms: any[];
  instructors: any[];
}

const GROUP_STATUSES = [
  { value: "active", label: "نشطة" },
  { value: "pending", label: "انتظار" },
  { value: "postponed", label: "مؤجلة" },
  { value: "cancelled", label: "ملغية" },
  { value: "finished", label: "منتهية" }
];

export default function GroupForm({
  open,
  onOpenChange,
  onSave,
  group,
  courses,
  levels,
  branches,
  rooms,
  instructors
}: GroupFormProps) {
  const [form, setForm] = React.useState<any>(group || {});

  React.useEffect(() => {
    setForm(group || {});
  }, [group]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{group ? "تعديل مجموعة" : "إضافة مجموعة"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>اسم المجموعة</Label>
            <Input name="name" value={form.name || ""} onChange={handleChange} required />
          </div>
          <div>
            <Label>الكورس</Label>
            <Select value={form.courseId || ""} onValueChange={v => handleSelect("courseId", v)}>
              <SelectTrigger><SelectValue placeholder="اختر الكورس" /></SelectTrigger>
              <SelectContent>
                {courses.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>المستوى</Label>
            <Select value={form.levelId || ""} onValueChange={v => handleSelect("levelId", v)}>
              <SelectTrigger><SelectValue placeholder="اختر المستوى" /></SelectTrigger>
              <SelectContent>
                {levels.map((l: any) => (
                  <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>الفرع</Label>
            <Select value={form.branchId || ""} onValueChange={v => handleSelect("branchId", v)}>
              <SelectTrigger><SelectValue placeholder="اختر الفرع" /></SelectTrigger>
              <SelectContent>
                {branches.map((b: any) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>القاعة</Label>
            <Select value={form.labId || ""} onValueChange={v => handleSelect("labId", v)}>
              <SelectTrigger><SelectValue placeholder="اختر القاعة" /></SelectTrigger>
              <SelectContent>
                {rooms.map((r: any) => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>المدرب</Label>
            <Select value={form.instructorId || ""} onValueChange={v => handleSelect("instructorId", v)}>
              <SelectTrigger><SelectValue placeholder="اختر المدرب" /></SelectTrigger>
              <SelectContent>
                {instructors.map((i: any) => (
                  <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button type="submit">حفظ</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
