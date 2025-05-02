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
      id: number;
      name: string;
      description: string;
      price: number;
      sessionsCount: number;
    }[];
  };
  categories: { id: number; name: string }[];
  levels: { id: number; name: string }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string | number | number[]) => void;
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
      const updatedLevels = [
        ...prevState.levels,
        {
          id: prevState.levels.length + 1,
          name: "",
          description: "",
          price: 0,
          sessionsCount: 0,
        },
      ];
      console.log("[ADD LEVEL] Updated Levels:", updatedLevels); // Log the updated levels
      return {
        ...prevState,
        levels: updatedLevels,
      };
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
            <div className="space-y-1">
            <div className="flex flex-row gap-2 mb-1 px-2">
                <div className="w-14 text-xs font-semibold text-muted-foreground text-center">الكود</div>
                <div className="w-24 text-xs font-semibold text-muted-foreground text-center">الاسم</div>
                <div className="w-20 text-xs font-semibold text-muted-foreground text-center">الوصف</div>
                <div className="w-20 text-xs font-semibold text-muted-foreground text-center">السعر</div>
                <div className="w-20 text-xs font-semibold text-muted-foreground text-center">عدد المحاضرات</div>
            </div>
            {(levels || []).map((level: any, idx: number, arr: any[]) => (
                <div key={idx} className="  border flex flex-row gap-2 items-end flex-nowrap relative mb-2">
                <Input
                    name="Code"
                    value={level.id || idx + 1}
                    onChange={(e) => handleCourseLevelChange(idx, "id", e.target.value)}
                    className="w-14 text-center"
                    placeholder=""
                />
                <Input
                    name="name"
                    value={level.name}
                    onChange={(e) => handleCourseLevelChange(idx, "name", e.target.value)}
                    className="w-24 text-center"
                    placeholder=""
                />
                <Input
                    name="description"
                    type="text"
                    value={level.description || ""}
                    onChange={(e) => handleCourseLevelChange(idx, "description", e.target.value)}
                    className="w-44 text-center"
                    placeholder=""
                />
                <Input
                name="price"
                type="number"
                value={level.price || ""}
                onChange={(e) => handleCourseLevelChange(idx, "price", e.target.value)}
                className="w-20 text-center"
                placeholder=""
                />
                <Input
                name="sessionsCount"
                type="number"
                value={level.sessionsCount || ""}
                onChange={(e) => handleCourseLevelChange(idx, "sessionsCount", e.target.value)}
                className="w-20 text-center"
                placeholder=""
                />

                {arr.length > 1 && idx === arr.length - 1 && (
                    <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="ml-1 w-8 h-8 flex items-center justify-center"
                    title="حذف المستوى الأخير"
                    onClick={() => {
                        const updatedLevels = arr.slice(0, -1);
                        setCourseFormData({ ...courseFormData, levels: updatedLevels });
                    }}
                    >
                    ×
                    </Button>
                )}
                </div>
            ))}
            <Button type="button" variant="outline" onClick={handleAddLevelInCourse}>
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
