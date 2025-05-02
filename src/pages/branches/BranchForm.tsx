import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface BranchFormProps {
  values: { name: string; address: string; areaId: string };
  areas: { id: string|number; name: string; cityName?: string }[];
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  onCancel?: () => void;
}

const BranchForm = ({ values, areas, onChange, onSubmit, submitLabel = "حفظ", onCancel }: BranchFormProps) => (
  <form onSubmit={onSubmit} className="space-y-3">
    <div>
      <Label>اسم الفرع *</Label>
      <Input value={values.name} onChange={e => onChange("name", e.target.value)} required />
    </div>
    <div>
      <Label>العنوان *</Label>
      <Input value={values.address} onChange={e => onChange("address", e.target.value)} required />
    </div>
    <div>
      <Label>المنطقة *</Label>
      <Select name="areaId" value={values.areaId} onValueChange={v => onChange("areaId", v)}>
        <SelectTrigger>
          <SelectValue placeholder="اختر المنطقة" />
        </SelectTrigger>
        <SelectContent>
          {areas.map((area, idx) => (
            <SelectItem key={area.id || idx} value={String(area.id)}>
              {area.name} - {area.cityName}
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

export default BranchForm;
