import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CategoryFormProps {
  values: { name: string; description: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  onCancel?: () => void;
}

const CategoryForm = ({ values, onChange, onSubmit, submitLabel = "حفظ", onCancel }: CategoryFormProps) => (
  <form onSubmit={onSubmit}>
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">اسم التصنيف *</Label>
        <Input 
          id="name"
          name="name"
          value={values.name}
          onChange={onChange}
          placeholder="مثال: التصنيف الأول"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">وصف التصنيف</Label>
        <Input 
          id="description"
          name="description"
          value={values.description}
          onChange={onChange}
          placeholder="مثال: هذا هو تصنيف جديد"
        />
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

export default CategoryForm;
