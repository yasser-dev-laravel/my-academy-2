import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CoursesFormProps {
  values: {
    name: string;
    description: string;
    isActive: boolean;
    categoryId: number;
    categoryName: string;
    applicationId: number;
    levels: {
    
      name: string;
      description: string;
      price: number;
      sessionsCount: number;
    }[];
  };
  categories: { id: number; name: string }[];
  levels: {  name: string; description: string; price: number; sessionsCount: number }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string | number | number[] | { name: string; description: string; price: number; sessionsCount: number }[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  onCancel?: () => void;
}

const CoursesForm: React.FC<CoursesFormProps> = ({
  values,
  categories,
  levels,
  onChange,
  onSelectChange,
  onSubmit,
  submitLabel = "Save",
  onCancel,
}) => {
  console.log("[CoursesForm] Values passed to the form:", values); // Log the values passed to the form

  const [courseFormData, setCourseFormData] = React.useState({
    name: "",
    description: "",
    isActive: false,
    categoryId: 0,
    categoryName: "",
    applicationId: 0,
    levels: [],
  });

  const handleCourseLevelChange = (idx: number, field: string, value: string): void => {
    setCourseFormData((prevState) => {
      const updatedLevels = [...prevState.levels];
      updatedLevels[idx] = {
        ...updatedLevels[idx],
        [field]: field === "price" || field === "sessionsCount" ? Number(value) : value,
      };
      return { ...prevState, levels: updatedLevels };
    });
  };

  const handleAddLevelInCourse = (): void => {
    setCourseFormData((prevState) => {
      const lastLevel = prevState.levels[prevState.levels.length - 1] || {
      
        name: "المستوي 1",
        description: "",
        price: 0,
        sessionsCount: 0,
      };
      const newLevel = {
        name: `المستوي ${prevState.levels.length}`,
        description: "",
        price: lastLevel.price,
        sessionsCount: lastLevel.sessionsCount,
      };
      return {
        ...prevState,
        levels: [...prevState.levels, newLevel],
      };
    });
  };

  const handleRemoveLevel = (idx: number): void => {
    setCourseFormData((prevState) => {
      const updatedLevels = prevState.levels.filter((_, index) => index !== idx);
      return { ...prevState, levels: updatedLevels };
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Course Name</Label>
          <Input id="name" name="name" value={values.name} onChange={onChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" name="description" value={values.description} onChange={onChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <Select
            name="categoryId"
            value={values.categoryId?.toString() || ""}
            onValueChange={(v) => onSelectChange("categoryId", Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="levels">Levels</Label>
          <div>
            <div className="flex flex-row gap-2 mb-1 px-2 border border-2 items-center flex-nowrap relative">
              <div className="w-14 text-xs font-semibold text-muted-foreground text-center">مسلسل</div>
              <div className="w-24 text-xs font-semibold text-muted-foreground text-center">الاسم</div>
              <div className="w-20 text-xs font-semibold text-muted-foreground text-center">الوصف</div>
              <div className="w-20 text-xs font-semibold text-muted-foreground text-center">السعر</div>
              <div className="w-20 text-xs font-semibold text-muted-foreground text-center">عدد المحاضرات</div>
            </div>
            <div>
                 {(values.levels || []).map((level: any, idx: number, arr: any[]) => (
              <div key={idx} className="border border-2 flex flex-row gap-2 items-end flex-nowrap relative mb-2">
                <Input
                  name={`levels[${idx}].serial`}
                  value={idx + 1}
                  readOnly
                  className="w-14 text-center"
                  placeholder=""
                />
                <Input
                  name={`levels[${idx}].name`}
                  value={level?.name || ""}
                  onChange={(e) => {
                    const updatedLevels = values.levels.map((lvl, i) =>
                      i === idx ? { ...lvl, name: e.target.value } : lvl
                    ); // Ensure immutability when updating levels
                    onChange({
                      target: {
                        name: "levels",
                        value: updatedLevels,
                      },
                    } as unknown as React.ChangeEvent<HTMLInputElement>);
                  }}
                  className="w-24 text-center"
                  placeholder="اسم المستوى"
                />
                <Input
                  name={`levels[${idx}].description`}
                  type="text"
                  value={level.description || ""}
                  onChange={(e) => {
                    const updatedLevels = values.levels.map((lvl, i) =>
                      i === idx ? { ...lvl, description: e.target.value } : lvl
                    ); // Ensure immutability when updating levels
                    onChange({
                      target: {
                        name: "levels",
                        value: updatedLevels,
                      },
                    } as unknown as React.ChangeEvent<HTMLInputElement>);
                  }}
                  className="w-44 text-center"
                  // placeholder="الوصف"
                />
                <Input
                  name={`levels[${idx}].price`}
                  type="number"
                  value={level.price !== undefined ? level.price : 0} // Ensure price is a valid number
                  onChange={(e) => {
                    const updatedLevels = values.levels.map((lvl, i) =>
                      i === idx ? { ...lvl, price: Number(e.target.value) } : lvl
                    ); // Ensure immutability when updating levels
                    onChange({
                      target: {
                        name: "levels",
                        value: updatedLevels,
                      },
                    } as unknown as React.ChangeEvent<HTMLInputElement>);
                  }}
                  className="w-20 text-center"
                  // placeholder="السعر"
                />
                <Input
                  name={`levels[${idx}].sessionsCount`}
                  type="number"
                  value={level.sessionsCount || ""}
                  onChange={(e) => {
                    const updatedLevels = values.levels.map((lvl, i) =>
                      i === idx ? { ...lvl, sessionsCount: Number(e.target.value) } : lvl
                    ); // Ensure immutability when updating levels
                    onChange({
                      target: {
                        name: "levels",
                        value: updatedLevels,
                      },
                    } as unknown as React.ChangeEvent<HTMLInputElement>);
                  }}
                  className="w-28 text-center"
                  // placeholder="عدد المحاضرات"
                />

                {idx === arr.length - 1 && arr.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="ml-1 w-8 h-8 flex items-center justify-center"
                    title="حذف المستوى الأخير"
                    onClick={() => {
                      const updatedLevels = arr.slice(0, -1);
                      onSelectChange("levels", updatedLevels);
                    }}
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
            </div>
         
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const lastLevel = values.levels[values.levels.length - 1] || {
               
                  name: "المستوي 1",
                  description: "",
                  price: 0,
                  sessionsCount: 0,
                };
                const newLevel = {
                  
                  name: `المستوي ${values.levels.length}`,
                  description: "",
                  price: lastLevel.price,
                  sessionsCount: lastLevel.sessionsCount,
                };
                onSelectChange("levels", [...(values.levels || []), newLevel]);
              }}
            >
              إضافة مستوى جديد
            </Button>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
};

export default CoursesForm;
