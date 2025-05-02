import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface RoomFormProps {
  values: { name: string; branchId: string; type: string; capacity: number|string };
  branches: { id: string|number; name: string }[];
  roomTypes: { value: string; label: string }[];
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  onCancel?: () => void;
}

const RoomForm = ({ values, branches, roomTypes, onChange, onSubmit, submitLabel = "حفظ", onCancel }: RoomFormProps) => (
  <form onSubmit={onSubmit} className="space-y-3">
    <div>
      <Label>اسم القاعة/المعمل *</Label>
      <Input value={values.name} onChange={e => onChange("name", e.target.value)} required name="name" />
    </div>
    <div>
      <Label>النوع *</Label>
      <Select name="type" value={values.type} onValueChange={v => onChange("type", v)}>
        <SelectTrigger>
          <SelectValue placeholder="اختر النوع" />
        </SelectTrigger>
        <SelectContent>
          {roomTypes.map(rt => (
            <SelectItem key={rt.value} value={rt.value}>{rt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label>السعة *</Label>
      <Input type="number" min={1} value={values.capacity} onChange={e => onChange("capacity", e.target.value)} required name="capacity" />
    </div>
    <div>
      <Label>الفرع *</Label>
      <Select name="branchId" value={values.branchId} onValueChange={v => onChange("branchId", v)}>
        <SelectTrigger>
          <SelectValue placeholder="اختر الفرع" />
        </SelectTrigger>
        <SelectContent>
          {branches.map((branch, idx) => (
            <SelectItem key={branch.id || idx} value={String(branch.id)}>
              {branch.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <DialogFooter>
      {onCancel && <Button type="button" variant="outline" onClick={onCancel}>إلغاء</Button>}
      <Button type="submit">{submitLabel}</Button>
    </DialogFooter>
  </form>
);

export default RoomForm;
